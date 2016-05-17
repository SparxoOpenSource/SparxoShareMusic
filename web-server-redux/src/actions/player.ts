import {player} from "../constants/actionTypes"
export function play() {
  return {
    type: player.play
  };
}
export function getList() {
  return {
    type:player.getList
  };
}
