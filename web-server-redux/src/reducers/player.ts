import {player} from "../constants/actionTypes"

var isMainPlayer = localStorage["isMainPlayer2"] || "0";

const initialState = {
    mainPlayer: isMainPlayer == "1",
    useSoundcloud:false,
    playSong: null,
    filter:"",
    playlist: []
}


var handlers = {
   
    [player.play]: function (state, action) {
        return $.extend({}, state, {
            playSong: action.playSong
        });
    },
    [player.add]: function (state, action) {
        return $.extend({}, state, {
            playlist: [action.data, ...state.playlist]
        });
    },
    [player.remove]: function (state, action) {

        return $.extend({}, state, {
            playlist: state.playlist.filter(data => {
                return data.id != action.id;
            })
        });
    },
    [player.list]: function (state, action) {
        return $.extend({}, state, {
            playlist: action.playlist,
            playSong: action.playSong
        });
    },
    [player.filter]: function (state, action) {
        return $.extend({}, state, {
            filter:action.keyword
        });
    },
    [player.toogle]: function (state, action) {
        localStorage["isMainPlayer2"]=state.mainPlayer?'0':'1';
        return $.extend({}, state, {
            mainPlayer: !state.mainPlayer
        });
    }
}

/**
 * 操作
 */
export default function playerReducer(state = initialState, action = { type: "" }) {

    var func = handlers[action.type];
    if (func) {
        return func(state, action);
    }
    return state;
}