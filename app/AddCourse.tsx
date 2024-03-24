"use client";
import { Button, Flex, Heading } from "@radix-ui/themes";
import toast, { Toaster } from "react-hot-toast";
import { saveCourse, saveFiles, saveSections } from "./AddCourseUtils";
import { useRouter } from "next/navigation";
import { set } from "idb-keyval";
import { useSession } from "next-auth/react";

const AddCourse = () => {
  const router = useRouter();
  const { data: session } = useSession();

  const processFolder = async (dirHandle: FileSystemDirectoryHandle) => {
    const toastId = toast.loading("Processing course...");

    const course = await saveCourse(dirHandle, session);
    if (!course) return toast.error("Failed to save course", { id: toastId });

    const sections = await saveSections(course.id, dirHandle);
    await saveFiles(sections, dirHandle);
    toast.success("Course processed!", { id: toastId });
  };

  const addCourse = async () => {
    if (!window.showDirectoryPicker)
      return toast.error("showDirectoryPicker is not supported");

    const dirHandle = await window.showDirectoryPicker();
    await processFolder(dirHandle);
    set(dirHandle.name, dirHandle);
    router.refresh();
  };

  return (
    <>
      <Flex justify="between" align="center">
        <Heading as="h1">Home</Heading>
        <Button
          size="3"
          variant="outline"
          className="!cursor-pointer"
          onClick={addCourse}
        >
          Add Course
        </Button>
      </Flex>

      <Toaster />
    </>
  );
};

export default AddCourse;
