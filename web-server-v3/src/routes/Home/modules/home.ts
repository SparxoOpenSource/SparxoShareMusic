import ws,{playlists,addSong,removeSong,playSong } from '../../../api/socket';

// ------------------------------------
// Constants
// ------------------------------------
export const PLAYLIST_ADD = 'PLAYLIST_ADD';
export const PLAYLIST_REMOVE = 'PLAYLIST_REMOVE';
export const PLAYLIST_PLAY = 'PLAYLIST_PLAY';
export const PLAYLIST_GET = "PLAYLIST_GET";

const soundcloud_key = "02gUJC0hH2ct1EGOcYXQIzRFU91c72Ea";

function parseQueryString(url): any {
    var queryIndex = url.indexOf("?"),
        queryObject = {},
        pairs;
    if (!url) {
        return null;
    }
    var queryString = url;
    if (queryIndex != -1) {
        queryString = url.substr(queryIndex + 1);
    }
    pairs = queryString.split('&');
    for (var pair of pairs) {
        if (pair === '') {
            continue;
        }
        var parts = pair.split(/=(.+)?/),
            key = parts[0],
            value = parts[1] && parts[1].replace(/\+/g, ' ');
        var existing = queryObject[key];
        if (existing) {
            if (Array.isArray(existing)) {
                existing.push(value);
            } else {
                queryObject[key] = [existing, value];
            }
        } else {
            queryObject[key] = value;
        }
    }
    return queryObject;
}

// ------------------------------------
// Actions
// ------------------------------------
export function get(data) {
    return {
        type: PLAYLIST_GET,
        payload: data
    }
}


export function add(data) {
    return {
        type: PLAYLIST_ADD,
        payload: data
    }
}
export function remove(data) {
    return {
        type: PLAYLIST_REMOVE,
        payload: data
    }
}
export function play(data) {
    return {
        type: PLAYLIST_PLAY,
        payload: data
    }
}

export function initAsync() {
    return (dispatch, getState) => {
        playlists().then((data) => {
            dispatch(get(data));
        });
        ws.on("song.add", (data) => {
            debugger;
            dispatch(add(data));
        }).on("song.remove", (data) => {
            dispatch(remove(data));
        }).on("song.play", data => {
            dispatch(play(data));
        });
    }
}

export function addAsync(url) {
    return (dispatch, getState) => {
        var user = getState().session.user;
        if (url.indexOf("http://www.xiami.com/song") == 0) {
            var location = url.split('?')[0];
            var id = location.replace("http://www.xiami.com/song/", "");
            var req = `http://www.xiami.com/song/playlist/id/${id}/object_name/default/object_id/0/cat/json?callback=?`;
            return $.ajax({
                url: req,
                dataType: "jsonp"
            }).done(json => {
                var data = json.data.trackList[0];
                if (data) {
                    var m = {
                        id: 'xiami-' + data.songId,
                        name: data.songName,
                        artists: [json.singers],
                        album: data.album_name,
                        image: data.album_pic,
                        resourceUrl: data.purview.filePath,
                        orderer: user
                    }
                    addSong(data);
                }
            });
        }

        if (url.indexOf("http://mp3.sogou.com/tiny/song") == 0) {
            var queryParams = parseQueryString(url);
            if (queryParams.tid) {
                return $.ajax({
                    url: "http://mp3.sogou.com/tiny/song?json=1&query=getlyric&tid=" + queryParams.tid,
                    dataType: 'jsonp',
                    jsonpCallback: "MusicJsonCallback"
                }).done((json) => {
                    var album_str = json.album_id + "";
                    var m = {
                        id: 'sogou-' + json.song_id,
                        name: json.song_name,
                        artists: [json.singer_name],
                        album: json.album_name,
                        image: "http://imgcache.qq.com/music/photo/album_300/" + parseInt(album_str.substr(album_str.length - 2)) + "/300_albumpic_" + json.album_id + "_0.jpg",
                        resourceUrl: json.play_url,
                        orderer: user
                    };
                    addSong(m);
                });
            }
        }
        if (url.indexOf("soundcloud.com") != -1) {
            var str = "";
            if (url.indexOf('?')) {
                str = url.split('?')[0];
            }
            var sp = str.split('/');
            var id: any = sp[sp.length - 1];
            return $.getJSON(`//api.soundcloud.com/tracks/${id}?client_id=${soundcloud_key}`)
                .done((data) => {
                    var m = {
                        id: `soundcloud-${data.id}`,
                        name: data.title,
                        artists: [data.user.username],
                        album: data.genre,
                        image: data.artwork_url,
                        resourceUrl: `${data.stream_url}?client_id=${soundcloud_key}`,
                        orderer: user
                    }
                    addSong(m);
                });
        }
    }
}

export function removeAsync(id) {
    return (dispatch, getState) => {
        removeSong(id);
    }
}

export function playAsync(id) {
    return (dispatch, getState) => {
        playSong(id);
    }
}

export const actions = {
    addAsync,
    playAsync,
    removeAsync,
    initAsync
}

// ------------------------------------
// Action Handlers
// ------------------------------------
const ACTION_HANDLERS = {
    [PLAYLIST_GET]: (state, action) => {
        return $.extend(null, state, action.payload);
    },
    [PLAYLIST_ADD]: (state, action) => {
        return $.extend(null, state, {
            playlist: [action.payload, ...state.playlist]
        });
    },
    [PLAYLIST_REMOVE]: (state, action) => {
        return $.extend(null, state, {
            playlist: state.playlist.filter(item => item.id != action.payload)
        });
    },
    [PLAYLIST_PLAY]: (state, action) => {
        return $.extend(null, state, { current: action.payload });
    }
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
    playlist: []
}

export default function counterReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];
    return handler ? handler(state, action) : state
}