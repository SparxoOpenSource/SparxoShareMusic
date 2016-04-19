var pomelo = require('pomelo');
var channelUtil = require('../../util/channelUtil');
var MessageService = require('../../services/messageService');
var WYMusicService = require('../../services/wyMusicService.js');
var ProxyService = require('../../services/proxyService.js');

var studio = function (opts) {
    this.studioId = opts.id;

    this.users = {};
    this.playerList = {};
    this.playingSong = null;
    this.channel = null;
}

module.exports = studio;

studio.prototype.getChannel = function () {
    if (!this.channel) {
        var channelName = channelUtil.getStudioChannelName(this.studioId);
        this.channel = pomelo.app.get('channelService').getChannel(channelName, true);
    }

    return this.channel;
};

studio.prototype.pushByUserName = function (userName, route, msg, cb) {
    var user = this.getUser(userName);
    if (!user) {
        cb(new Error('user[' + userName + '] is not in this studio'));
        return;
    }
    MessageService.pushMessageToUser({ uid: user.name, sid: user.serverId }, route, msg);
    pomelo.app.get('channelService').pushMessageByUids(route, msg, [{ uid: user.userName, sid: user.serverId }], cb);
};

studio.prototype.getPlayerMusicList = function () {
    var playerList = this.playerList;
    var list = [];
    for (var m in playerList) {
        list.push(playerList[m]);
    }
    return list;
};

studio.prototype.getMusic = function (id, cb) {
    var music = this.playerList[id];
    if (!music) {
        cb('music not exist! ');
        return;
    }
    return music;
};

studio.prototype.addMusic = function (url, userName, cb) {
    var self = this;
    var getMusicFunc = function (err, music) {
        if (!!err) {
            cb('get music by url error! ');
            return;
        }
        music.orderer = userName;
        self.playerList[music.id] = music;
        self.getChannel().pushMessage('onMusicAdd', music, cb);
    };
    if (pomelo.app.get('appConfig').useProxy) {
        ProxyService.getIp(function (err, ip) {
            WYMusicService.getMusicByUrl(url, ip, getMusicFunc);
        });
    }
    else {
        WYMusicService.getMusicByUrl(url, null, getMusicFunc);
    }
};

studio.prototype.playMusic = function (id, cb) {
    var music = this.playerList[id];
    if (!music) {
        cb('music not exist! ');
        return;
    }
    this.playingSong = music;
    this.getChannel().pushMessage('onMusicPlay', music, cb);
};

studio.prototype.removeMusic = function (id, cb) {
    delete this.playerList[id];
    this.getChannel().pushMessage('onMusicRemove', { id: id }, cb);
};

studio.prototype.getUser = function (userName) {
    return this.users[userName];
};

studio.prototype.addUser = function (user) {
    this.users[user.name] = user;
    this.getChannel().add(user.name, user.serverId);
};

studio.prototype.removeUser = function (userName) {
    var user = this.users[userName];
    this.getChannel().leave(user.name, user.serverId);
    delete this.users[userName];
};

studio.prototype.getPlayingSong = function () {
    return this.playingSong;
}
