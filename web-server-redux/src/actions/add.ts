import {add} from "../constants/actionTypes"
import * as $studio from "../api/studio";
import * as $ from "jquery";
import {keys} from "../constants/config";
export function showAddModal(isShow) {
    return (isShow ? { type: add.show } : { type: add.hide });
}

function Pending() {
    return {
        type: add.pending
    };
}

function Fail(msg?) {
    return {
        type: add.error,
        errorMessage: msg
    }
}
function Success() {
    return {
        type: add.success
    }
}

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
export function addMusic() {
    return (dispatch, getState) => {
        const add = getState().form.add;
        const url = add.url.value;
        if (url == "") {
            dispatch(Fail("url error"));
            return;
        }
        if (url.indexOf("http://music.163.com") == 0) {               
            dispatch(Pending());
            $studio.add(url).then(() => {
                dispatch(Success());
            })
        }
        else if (url.indexOf("http://mp3.sogou.com/tiny/song") == 0) {
            var queryParams = parseQueryString(url);
            if (queryParams.tid) {
                dispatch(Pending());
                return $.ajax({
                    url: "http://mp3.sogou.com/tiny/song?json=1&query=getlyric&tid=" + queryParams.tid,
                    dataType: 'jsonp',
                    jsonpCallback: "MusicJsonCallback"
                }).done((json) => {
                    var album_str = json.album_id + "";
                    $studio.importMusic([{
                        id: 'sogou-' + json.song_id,
                        name: json.song_name,
                        artists: [json.singer_name],
                        album: json.album_name,
                        image: "http://imgcache.qq.com/music/photo/album_300/" + parseInt(album_str.substr(album_str.length - 2)) + "/300_albumpic_" + json.album_id + "_0.jpg",
                        resourceUrl: json.play_url,
                        orderer: sessionStorage['username2'] || ""
                    }]).then(() => {
                        dispatch(Success());
                    })
                });
            } else {
                dispatch(Fail("url格式可能错误，没有找到tid字段"));
            }
        }
        else {
            var str = "";
            if (url.indexOf('?')) {
                str = url.split('?')[0];
            }
            var sp = str.split('/');
            var id = sp[sp.length - 1];            
            dispatch(Pending());
            return $.getJSON(`//api.soundcloud.com/tracks/${id}?client_id=${keys.soundcloud_key}`)
                .done((data) => {
                    var music = {
                        id: `soundcloud-${data.id}`,
                        name: data.title,
                        artists: [data.user.username],
                        album: data.genre,
                        image: data.artwork_url,
                        resourceUrl: `${data.stream_url}?client_id=${keys.soundcloud_key}`,
                        orderer: sessionStorage['username2'] || ""
                    }
                    $studio.importMusic([music])
                        .then(() => {
                            dispatch(Success());
                        })
                }).fail(err => {
                    dispatch(Fail("reques soundclound fail!"))
                });
        }
    }
}