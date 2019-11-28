import React from "react";
import ReactPlayer from "react-player";
import "../Media.scss";

interface PropsType {
  id: string;
  svg: JSX.Element;
  playing: boolean;
  volume: number;
  url: string;
  handleClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  //handlePause: () => void;
}

const Sound = ({
  id,
  svg,
  playing,
  volume,
  url,
  handleClick,
  handleVolumeChange
}: //handlePause
PropsType) => {
  console.log("Sound ", url);
  return (
    <div id="media-section" className="media-section">
      <button id={id} className="media-btn" onClick={handleClick}>
        {svg}
        <ReactPlayer
          url={url}
          volume={volume}
          playing={playing}
          width={0}
          height={0}
          preload={true}
          loop={true}
        />
      </button>
      <input
        id={id}
        className="volume_control"
        type="range"
        min={0}
        max={1}
        step="any"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default Sound;
