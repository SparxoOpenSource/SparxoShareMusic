
import io = require('socket.io-client');
let ws = io.connect('/');

export function join(user_name, room_id) {
    return new Promise((resolve, reject) => {
        ws.once('join_success', (success, msg) => {
            if (success) {
                resolve(msg);
            } else {
                reject(msg);
            }
        }).emit('join', user_name, room_id);
    });
}
export function playlists() {
    return new Promise((resolve, reject) => {
        ws.once('playlists_success', (success, list) => {
            if (success) {
                resolve(list);
            } else {
                reject('fail');
            }
        }).emit('playlists');
    });
}

export function addSong(data) {
    ws.emit('song.add', data);
}
export function removeSong(data) {
    ws.emit('song.remove', data);
}
export function playSong(data) {
    ws.emit('song.play', data);
}
export function sendMessage(msg){
    ws.emit('send.message',msg);
}
export default ws;
