import {player} from "../constants/actionTypes"
import * as $player from "../api/player";
import * as $studio from '../api/studio';


function receivePlay(song) {
  return {
    type: player.play,
    playSong: song
  }
}
export function play(songId) {
  return (dispatch, getState) => {
    var list = getState().player.playlist;
    var song = list.find(item => item.id == songId);
    $studio.play(songId).then(() => {
      dispatch(receivePlay(song));
    });
  };
}

function receiveList(data) {
  return {
    type: player.list,
    playlist: data.playerMusicList,
    playSong: data.playingSong
  }
}

function receiveAdd(data) {
  return {
    type: player.add,
    data: data
  }
}

function receiveRemove(id) {
  return {
    type: player.remove,
    id: id
  }
}

export function remove(id) {
  $studio.remove(id);
}

export function init() {
  return (dispatch, getState) => {
    $studio.on("onMusicAdd", (data) => {
      dispatch(receiveAdd(data));
    }).on("onMusicRemove", (data) => {
      dispatch(receiveRemove(data.id));
      console.log('remove', data);
    }).on("onMusicPlay", (data) => {
      dispatch(receivePlay(data));
      console.log(data);
    }).on("onUserLeave", (data) => {

    });
    $studio.getPlaylist().then((data) => {
      dispatch(receiveList(data));
    }).fail((err) => {
      alert(err);
    });
  };
}