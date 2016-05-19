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
    playlist: data.playerMusicList.filter(m => m.resourceUrl != null),
    playSong: data.playingSong
  }
}

function receiveAdd(data) {
  if (data.resourceUrl) {
    return {
      type: player.add,
      data: data
    }
  }
}

function receiveRemove(id) {
  return {
    type: player.remove,
    id: id
  }
}

export function remove(id) {
  if (confirm("确定？")) {
    $studio.remove(id);
  }
}

export function toogleMianPlayer() {
  return {
    type: player.toogle
  };
}
export function filter(s) {
  return {
    type: player.filter,
    keyword: s
  };
}
export function importMusic(musics) {
  //console.log('import',musics);
  $studio.importMusic(musics).then(()=>{
    alert("导入成功");
  });
}
export function init() {
  return (dispatch, getState) => {
    $studio.on("onMusicAdd", (data) => {
      console.log("add", data);
      dispatch(receiveAdd(data));
    }).on("onMusicRemove", (data) => {
      console.log('remove', data);
      dispatch(receiveRemove(data.id));
    }).on("onMusicPlay", (data) => {
      console.log('play', data);
      dispatch(receivePlay(data));
    }).on("onUserLeave", (data) => {

    });
    $studio.getPlaylist().then((data) => {
      dispatch(receiveList(data));
    }).fail((err) => {
      alert(err);
    });
  };
}