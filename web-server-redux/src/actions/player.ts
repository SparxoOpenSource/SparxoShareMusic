import {player} from "../constants/actionTypes"

import * as $player from "../api/player";

export function play() {
  return {
    type: player.play
  };
}

function receiveList(list) {
  return {
    type: player.getList,
    items: list
  }
}
export function getList() {  
  return (dispatch)=>{
    $player.getList().then((res)=>{      
      dispatch(receiveList(res));
    })    
  };
}
