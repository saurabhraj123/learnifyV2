import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";

interface Props {
  src: string;
}
const VideoPlayer = ({ src }: Props) => {
  return (
    <MediaPlayer title="Sprite Fight" aspectRatio="16/9" src={src} autoPlay>
      <MediaProvider />
      <DefaultVideoLayout icons={defaultLayoutIcons} />
    </MediaPlayer>
  );
};

export default VideoPlayer;
