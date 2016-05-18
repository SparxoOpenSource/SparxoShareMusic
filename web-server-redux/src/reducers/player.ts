import {player} from "../constants/actionTypes"

const initialState = {
    inited: false,
    playSong: null,
    playlist: []
}


var handlers = {
    [player.play]: function (state, action) {
        return Object.assign({}, state, {
            playSong: action.playSong
        });
    },
    [player.add]: function (state, action) {
        return Object.assign({}, state, {
            playlist: [...state.playlist, action.data]
        });
    },
    [player.remove]: function (state, action) {

        return Object.assign({}, state, {
            playlist: state.playlist.filter(data => {
                return data.id != action.id;
            })
        });
    },
    [player.list]: function (state, action) {
        return Object.assign({}, state, {
            playlist: action.playlist,
            playSong: action.playSong
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