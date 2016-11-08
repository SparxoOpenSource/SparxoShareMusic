const io = require('socket.io');
const fs = require("fs");


function getData(room_id) {
    var json_path = "./playlists_" + room_id + ".json";
    if (!fs.existsSync(json_path)) {
        fs.writeFileSync(json_path, JSON.stringify({ playlist: [], current: null }));
    }
    var data = JSON.parse(fs.readFileSync(json_path));
    return data;
}
function writeData(room_id, data) {
    var json_path = "./playlists_" + room_id + ".json";
    fs.writeFileSync(json_path, JSON.stringify(data));    
}
function addItems(room_id, item) {
    var data = getData(room_id);
    var addItems=[];
    if(toString.call(item)=='[object Array]'){
        addItems=item;
    }
    else{
        addItems=[item];
    }
    var result=[];
    for(var i=0;i<addItems.length;i++){
        var addItem=addItems[i];
        var s=data.playlist.find((temp)=>temp.id==addItem.id);
        if(!s){
            result.push(addItem);
        }
    }
    data.playlist.unshift.apply(data.playlist,result);   
    writeData(room_id,data);
    return result;
}
function removeItem(room_id, remove_id) {
    var data = getData(room_id);
    data.playlist = data.playlist.filter(function (item) { return item.id != remove_id });
    writeData(room_id, data);
    return true;
}

function playItem(room_id,play_id) {
    var data = getData(room_id);
    var s = data.playlist.filter(function (item) { return item.id == play_id });
    if (s.length > 0) {
        data.current = play_id;
        writeData(room_id, data);
        return true;
    }
    return false;
}

module.exports = function (server,app) {
    var ws = io.listen(server);

    var checkNickname = function (name, room_id) {
        for (var k in ws.sockets.sockets) {
            if (ws.sockets.sockets.hasOwnProperty(k)) {
                if (ws.sockets.sockets[k] && ws.sockets.sockets[k].nickname == name && ws.sockets[k].room_id == room_id) {
                    return true;
                }
            }
        }
        return false;
    }
    ws.on('connection', function (client) {
        client.on('join', function (user, room_id) {
            // 检查是否有重复
            if (checkNickname(user, room_id)) {
                client.emit('join_success', false, user);
                return;
            }
            client.nickname = user;
            client.room_id = room_id;

            client.emit('join_success', true, user);
        });

        client.on('playlists', function () {
            var data = getData(client.room_id);     
            ws.sockets.emit('playlists_success', true, data);
        });

        client.on('song.add', function (data) {
            var added= addItems(client.room_id, data);
            if (added.length>0) {
                ws.sockets.emit('song.add', added);
            } else {
                console.log("add-fail");
            }
        });

        client.on('song.remove', function (data) {
            if (removeItem(client.room_id, data)) {
                ws.sockets.emit('song.remove', data);
            }
        });

        client.on('song.play', function (data) {
            if (playItem (client.room_id, data)) {
                ws.sockets.emit('song.play', data);
            }
        });

        // 监听发送消息
        client.on('send.message', function (msg) {
            ws.sockets.emit('send.message', client.nickname, msg);
        });

        // 断开连接时，通知其它用户
        client.on('disconnect', function () {
            if (client.nickname) {
                ws.sockets.emit('user.quit', client.nickname);
            }
        });
    });
}

