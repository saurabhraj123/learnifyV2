import { Course, File as FileSchema, Section } from "@prisma/client";
import axios from "axios";

/** Internal Utils */
const getVideoDuration = async (file: File) => {
  return new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    video.style.display = "none";
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      resolve(video.duration);
      video.remove();
    };

    video.onerror = (err) => {
      reject(err);
      video.remove();
    };

    video.src = URL.createObjectURL(file);
  });
};

const getSectionNames = async (dirHandle: FileSystemDirectoryHandle) => {
  const sectionNames = [];
  for await (const [name, entry] of dirHandle)
    if (entry.kind === "directory") sectionNames.push(name);
  return sectionNames;
};

/** External Utils */

export const getFiles = async (
  sectionId: string,
  dirHandle: FileSystemDirectoryHandle
) => {
  const files: FileSchema[] = [];

  for await (const [name, entry] of dirHandle) {
    if (entry.kind === "file") {
      const file = await entry.getFile();

      if (!file.type) continue;

      let duration = 0;
      if (file.type.includes("video")) {
        duration = await getVideoDuration(file);
      }

      const fileData = {
        id: file.name,
        title: name,
        size: file.size,
        type: file.type,
        duration,
        sectionId,
      };

      files.push(fileData);
    }
  }

  return files;
};

export const saveSections = async (
  courseId: string,
  dirHandle: FileSystemDirectoryHandle
) => {
  const sectionNames = await getSectionNames(dirHandle);

  const promises = sectionNames.map(async (sectionName) => {
    return axios.post<Section>("/api/section", {
      title: sectionName,
      courseId,
    });
  });

  const sectionsResolved = await Promise.all(promises);
  return sectionsResolved.map((section) => section.data);
};

export const saveCourse = async (dirHandle: FileSystemDirectoryHandle) => {
  const { name } = dirHandle;
  try {
    const { data: course } = await axios.post<Course>("/api/course", {
      title: name,
    });
    return course;
  } catch (err) {
    console.error(err);
  }
};

export const saveFiles = async (
  sections: Section[],
  dirHandle: FileSystemDirectoryHandle
) => {
  for (const section of sections) {
    const sectionHandle = await dirHandle.getDirectoryHandle(section.title);
    const files = await getFiles(section.id, sectionHandle);

    const uploadPromises = files.map((file) => {
      return axios.post("/api/file", file);
    });

    try {
      await Promise.all(uploadPromises);
    } catch (err) {
      console.error(err);
    }
  }
};
