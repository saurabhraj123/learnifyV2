"use client";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { get } from "idb-keyval";
import { useEffect, useState } from "react";
import Skeleleton from "@/app/components/Skeleton";

interface Props {
  fileName?: string;
  courseName?: string;
  sectionName?: string;
}

const VideoPlayer = ({ fileName, sectionName, courseName }: Props) => {
  const [src, setSrc] = useState<any>("");

  async function updateSrc() {
    if (!courseName || !sectionName || !fileName) return;

    const dirHandle = await get(courseName);
    // console.log("here", dirHandle, sectionName);
    const sectionHandle = await dirHandle.getDirectoryHandle(sectionName);
    const fileHandle = await sectionHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    // console.log({ fileHandle, sectionHandle, dirHandle, file });
    const url = URL.createObjectURL(file);
    setSrc({ src: url, type: "video/mp4" });
  }

  useEffect(() => {
    updateSrc();
  }, []);

  // if (!src) return <Skeleleton height={20} />;

  return (
    <MediaPlayer
      title="Sprite Fight"
      aspectRatio="16/9"
      src={src}
      autoPlay
      style={{ height: "100%" }}
    >
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
