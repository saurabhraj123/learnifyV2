import { Course, File as FileSchema, Section, User } from "@prisma/client";
import axios from "axios";
import { Session } from "next-auth";

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
  type FileSchemaWithoutSlug = Omit<FileSchema, "slug">;
  const files: FileSchemaWithoutSlug[] = [];

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

export const saveCourse = async (
  dirHandle: FileSystemDirectoryHandle,
  session: Session | null
) => {
  const { name } = dirHandle;
  try {
    const { data: course } = await axios.post<Course>("/api/course", {
      title: name,
      userId: (session?.user as User)?.id,
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
  sections.sort((a, b) => (a.title < b.title ? -1 : 1));
  let firstFile;

  for (const section of sections) {
    const sectionHandle = await dirHandle.getDirectoryHandle(section.title);
    const files = await getFiles(section.id, sectionHandle);
    files.sort();
    const uploadPromises = files.map((file) => {
      return axios.post("/api/file", file);
    });
    try {
      const res = await Promise.all(uploadPromises);
      if (!firstFile) firstFile = res[0].data;
    } catch (err) {
      console.error(err);
    }
  }

  return firstFile;
};

export const updateLastOpenedResource = async (
  courseId: string,
  resourceId: string
) => {
  return axios.patch(`/api/course`, {
    courseId,
    lastOpenedResourceId: resourceId,
  });
};
