import q = require("q");
const Emitter = require("component-emitter");

window.EventEmitter = Emitter;
import "pomelo-protocol/lib/protocol";
import "pomelo-protobuf/lib/client/protobuf";
import "pomelo-jsclient-websocket/lib/pomelo-client";

import {server} from "../../constants/config";

var room = {
    host: '',
    port: 0
}
function request(route, param?) {
    var def = q.defer();
    pomelo.request(route, param, data => {
        def.resolve(data);
    })
    return def.promise;
}

export function connect(uid) {
    var def = q.defer();
    pomelo.init({
        host: server.ip,
        port: server.port
    }, (s) => {
        var route = 'gate.gateHandler.queryEntry';
        request(route, { userName: uid }).then((data: any) => {
            pomelo.disconnect();
            if (data.code === 500) {
                def.reject("There is no server to log in, please wait.");
                return;
            }
            room.host = data.host;
            room.port = data.port;
            def.resolve();
        })

    });

    return def.promise;
}
var eventBuilder = {
    on: function (eventName, cb: (data) => void) {
        pomelo.on(eventName, cb);
        return eventBuilder;
    },
    once: function (eventName, cb: (data) => void) {
        pomelo.once(eventName, cb);
        return eventBuilder;
    }
}
export var on = eventBuilder.on;
export var once = eventBuilder.once;

export function studio() {
    var def = q.defer();
    pomelo.init({
        host: room.host,
        port: room.port,
        reconnect: true,
        maxReconnectAttempts: 20,
    }, (data) => {
        def.resolve();
    });

    return def.promise;
}

export function checkUserName(userName) {
    var route = "connector.entryHandler.isUserExisted";
    var d = q.defer();
    //return new Promise((resolve, reject) => {
    pomelo.request(route, {
        userName: userName
    }, function (data) {
        if (data.code != 500 && !data.isExisted) {
            d.resolve();
        } else {
            pomelo.disconnect();
            d.reject("用户名已经存在")
        }
    });
    return d.promise;
}

export function enter(uid, studioId) {
    var def = q.defer();
    var route = "connector.entryHandler.enter";
    request(route, { userName: uid, studioId: studioId })
        .then((data: any) => {
            if (data.code === 500) {
                def.reject("error");
                return;
            }
            def.resolve();
        });
    return def.promise;
}
export function enterSence() {
    var route = "studio.studioHandler.enterStudio";
    return request(route);
}

export function getPlaylist() {
    var def = q.defer();
    var self = this;
    var route = "studio.studioHandler.getPlayerMusicList";
    request(route)
        .then((data: any) => {
            if (data.code !== 500) {
                def.resolve(data);
            }
            else {
                def.reject("获取列表失败");
            }
        });
    return def.promise;
}

export function play(id) {
    var route = "studio.studioHandler.playMusic";
    return request(route, { id: id });
}

export function add(url) {
    var route = "studio.studioHandler.addMusic";
    return request(route, { url: url });
}

export function remove(id) {
    var route = "studio.studioHandler.removeMusic";
    return request(route, { id: id })
}
export function importMusic(musics) {
    var d = q.defer();
    var route = "studio.studioHandler.importMusic";
    pomelo.request(route, { list: musics }, function (data) {
        d.resolve();
    });
    return d.promise;
}