const PLAY = "media/PLAY" as const;
const CHANGE_VOLUME = "media/CHANGE_VOLUME" as const;
const STOP = "media/STOP" as const;

export const play = (id: number, url: string) => ({
  type: PLAY,
  payload: { id, url }
});
export const changeVolume = (id: number, volume: number) => ({
  type: CHANGE_VOLUME,
  payload: { id, volume }
});
export const stop = () => ({ type: STOP });

type MediaAction =
  | ReturnType<typeof play>
  | ReturnType<typeof changeVolume>
  | ReturnType<typeof stop>;

interface MediaState {
  playing: Array<boolean>;
  volume: Array<number>;
  url: Array<string>;
}

const initialState: MediaState = {
  playing: [false, false, false, false],
  volume: [0.5, 0.5, 0.5, 0.5],
  url: ["", "", "", ""]
};

export default function media(
  state: MediaState = initialState,
  action: MediaAction
): MediaState {
  switch (action.type) {
    case PLAY:
      let state_play = { ...state };
      state_play.playing[action.payload.id] = !state.playing[action.payload.id];
      state_play.url[action.payload.id] = action.payload.url;
      console.log("state_play", state_play);
      return state_play;
    case CHANGE_VOLUME:
      let state_volume = { ...state };
      state_volume.volume[action.payload.id] = action.payload.volume;
      console.log(state_volume);
      return state_volume;
    /* case STOP:
      return { ...state, url: "" }; */
    default:
      return state;
  }
}
