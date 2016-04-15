﻿var utils = require('../util/utils');
var dispatcher = require('../util/dispatcher');
var Code = {
    OK: 200,
    CHAT: {
        FA_CHANNEL_CREATE: 3001,
        FA_CHANNEL_NOT_EXIST: 3002,
        FA_UNKNOWN_CONNECTOR: 3003,
        FA_USER_NOT_ONLINE: 3004,
        FA_CHATTER_EXIST: 3005,
        FA_MESSAGE_TOO_FREQUENTLY: 3006,
        FA_EMPTY_CONTENT: 3007
    }
};

var ChatService = function (app) {
    this.app = app;
    this.uidMap = {};
    this.nameMap = {};
    this.channelMap = {};
    this.appConfig = app.get("appConfig");
};

module.exports = ChatService;

/**
 * Add player into the channel
 *
 * @param {String} uid         user id
 * @param {String} playerName  player's role name
 * @param {String} channelName channel name
 * @return {Number} see consts.js
 */
ChatService.prototype.add = function (uid, playerName, channelName) {
    var sid = getSidByUid(uid, this.app);
    if (!sid) {
        return Code.CHAT.FA_UNKNOWN_CONNECTOR;
    }

    if (checkDuplicate(this, uid, channelName)) {
        return Code.OK;
    }

    utils.myPrint('channelName = ', channelName);
    var channel = this.app.get('channelService').getChannel(channelName, true);
    if (!channel) {
        return Code.CHAT.FA_CHANNEL_CREATE;
    }

    channel.add(uid, sid);
    addRecord(this, uid, playerName, sid, channelName);

    return Code.OK;
};


/**
 * User leaves the channel
 *
 * @param  {String} uid         user id
 * @param  {String} channelName channel name
 */
ChatService.prototype.leave = function (uid, channelName) {
    var record = this.uidMap[uid];
    var channel = this.app.get('channelService').getChannel(channelName, true);

    if (channel && record) {
        channel.leave(uid, record.sid);
    }

    removeRecord(this, uid, channelName);
};

/**
 * Kick user from chat service.
 * This operation would remove the user from all channels and
 * clear all the records of the user.
 *
 * @param  {String} uid user id
 */
ChatService.prototype.kick = function (uid) {
    var channelNames = this.channelMap[uid];
    var record = this.uidMap[uid];

    if (channelNames && record) {
        // remove user from channels
        var channel;
        for (var name in channelNames) {
            channel = this.app.get('channelService').getChannel(name);
            if (channel) {
                channel.leave(uid, record.sid);
            }
        }
    }

    clearRecords(this, uid);
};

/**
 * Push message by the specified channel
 *
 * @param  {String}   channelName channel name
 * @param  {Object}   msg         message json object
 * @param  {Function} cb          callback function
 */
//ChatService.prototype.pushByChannel = function (channelName, msg, cb) {
//    var channel = this.app.get('channelService').getChannel(channelName);
//    if (!channel) {
//        cb(new Error('channel ' + channelName + ' dose not exist'));
//        return;
//    }

//    channel.pushMessage(this.appConfig.event.chat, msg, cb);
//    this.pushByChannel
//};

ChatService.prototype.pushByChannel = function (channelName, route, msg, cb) {
    var channel = this.app.get('channelService').getChannel(channelName);
    if (!channel) {
        cb(new Error('channel ' + channelName + ' dose not exist'));
        return;
    }

    channel.pushMessage(route, msg, cb);
};

/**
 * Push message to the specified player
 *
 * @param  {String}   playerName player's role name
 * @param  {Object}   msg        message json object
 * @param  {Function} cb         callback
 */
ChatService.prototype.pushByPlayerName = function (playerName, msg, cb) {
    var record = this.nameMap[playerName];
    if (!record) {
        cb(null, Code.CHAT.FA_USER_NOT_ONLINE);
        return;
    }

    this.app.get('channelService').pushMessageByUids(this.appConfig.event.chat, msg, [{ uid: record.uid, sid: record.sid }], cb);
};

ChatService.prototype.pushByUserId = function (userId, msg, cb) {
    var record = this.uidMap[userId];
    if (!record) {
        cb(null, Code.CHAT.FA_USER_NOT_ONLINE);
        return;
    }
    this.app.get('channelService').pushMessageByUids(this.appConfig.event.chat, msg, [{ uid: record.uid, sid: record.sid }], cb);
}

ChatService.prototype.getUidsByChannelName = function (channelName, flag) {
    var users = [];
    var channel = this.app.get('channelService').getChannel(channelName, flag);
    if (!!channel) {
        users = channel.getMembers();
    }
    return users;
};

ChatService.prototype.getChannelNamesCacheByUserId = function (userId) {
    var channelNames = [];
    for (var name in this.channelMap[userId]) {
        channelNames.push(name);
    };
    return channelNames;
}

/**
 * Cehck whether the user has already in the channel
 */
var checkDuplicate = function (service, uid, channelName) {
    return !!service.channelMap[uid] && !!service.channelMap[uid][channelName];
};

/**
 * Add records for the specified user
 */
var addRecord = function (service, uid, name, sid, channelName) {
    var record = { uid: uid, name: name, sid: sid };
    service.uidMap[uid] = record;
    service.nameMap[name] = record;
    var item = service.channelMap[uid];
    if (!item) {
        item = service.channelMap[uid] = {};
    }
    item[channelName] = 1;
};

/**
 * Remove records for the specified user and channel pair
 */
var removeRecord = function (service, uid, channelName) {
    delete service.channelMap[uid][channelName];
    if (utils.size(service.channelMap[uid])) {
        return;
    }

    // if user not in any channel then clear his records
    clearRecords(service, uid);
};

/**
 * Clear all records of the user
 */
var clearRecords = function (service, uid) {
    delete service.channelMap[uid];

    var record = service.uidMap[uid];
    if (!record) {
        return;
    }

    delete service.uidMap[uid];
    delete service.nameMap[record.name];
};

/**
 * Get the connector server id assosiated with the uid
 */
var getSidByUid = function (uid, app) {
    var connector = dispatcher.dispatch(uid, app.getServersByType('connector'));
    if (connector) {
        return connector.id;
    }
    return null;
};
