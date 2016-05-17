import {player} from "../constants/actionTypes"
export function play() {
  return {
    type: player.play,
  };
}
