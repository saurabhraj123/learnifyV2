"use client";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { set, get } from "idb-keyval";
import { useEffect, useState } from "react";

interface Props {
  fileName: string;
  courseName: string;
  sectionName: string;
}

const VideoPlayer = ({ fileName, sectionName, courseName }: Props) => {
  const [src, setSrc] = useState<any>("");

  async function updateSrc() {
    const dirHandle = await get(courseName);
    const sectionHandle = await dirHandle.getDirectoryHandle(sectionName);
    const fileHandle = await sectionHandle.getFileHandle(fileName);
    const file = await fileHandle.getFile();
    const url = URL.createObjectURL(file);
    setSrc({ src: url, type: "video/mp4" });
  }

  useEffect(() => {
    updateSrc();
  }, []);

  return (
    <MediaPlayer title="Sprite Fight" aspectRatio="16/9" src={src} autoPlay>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
