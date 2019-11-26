import React from "react";
import Sound from "../components/Icons/Sound";
import { useSelector, useDispatch } from "react-redux";
import { play, changeVolume, stop } from "../store/modules/media";
import { RootState } from "../store/modules";
import { svg } from "../components/Icons/svg";

const SoundContainer = () => {
  const media = useSelector((state: RootState) => state.media); // re-render component when there's a change in media/state
  const playing = useSelector((state: RootState) => state.media.playing);
  const volume = useSelector((state: RootState) => state.media.volume);
  const url = useSelector((state: RootState) => state.media.url);

  const sounds = [
    "/Real-rain-sound.mp3",
    "/storm.mp3",
    "/Burning-fire.mp3",
    "/wind-chime.mp3",
    "/birds.mp3",
    "/cafe.mp3",
    "/waves.mp3"
  ];
  const svgs = svg;

  const dispatch = useDispatch();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const id = Number(e.currentTarget.id);
    const soundFile = process.env.PUBLIC_URL + sounds[id]; //"/Real-rain-sound.mp3";
    console.log(soundFile);
    console.log(e.currentTarget.id);
    dispatch(play(id, soundFile));
    let el = document.getElementsByClassName("media-section")[id];
    if (el != null) {
      if (el.className == "media-section") {
        el.className += " playing";
      } else {
        el.className = "media-section";
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = Number(e.currentTarget.id);
    console.log(id);
    const volume = Number(e.target.value);
    dispatch(changeVolume(id, volume));
  };

  const soundList: React.ReactElement[] = svgs.map((svg, index) => (
    <Sound
      id={String(index)}
      svg={svg}
      url={url[index]}
      playing={playing[index]}
      volume={volume[index]}
      handleClick={handleClick}
      handleVolumeChange={handleVolumeChange}
      //handlePause={handleStop}
    />
  ));

  return <div className="soundList">{soundList}</div>;
};

export default SoundContainer;
