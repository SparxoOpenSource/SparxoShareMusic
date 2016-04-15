module.exports = function (app) {
    return new ChatRemote(app, app.get('chatService'));
};

var ChatRemote = function (app, chatService) {
    this.app = app;
    this.chatService = chatService;
    this.appConfig = app.get("appConfig");
};

/**
 *	Add player into channel
 */
ChatRemote.prototype.add = function (uid, playerName, channelName, cb) {
    var code = this.chatService.add(uid, playerName, channelName);
    if (code == Code.CHAT.FA_UNKNOWN_CONNECTOR) {
        cb(code);
    }
    this.chatService.pushByChannel(channelName, this.appConfig.event.chatAdd, { user_id: uid, channel_name: channelName });
    cb(null, { code: code, player_uids: this.chatService.getUidsByChannelName(channelName) });
};

/**
 * leave Channel
 * uid
 * channelName
 */
ChatRemote.prototype.leave = function (uid, channelName, cb) {
    this.chatService.leave(uid, channelName);
    this.chatService.pushByChannel(channelName, this.appConfig.event.chatLeave, { user_id: uid, channel_name: channelName });
    cb();
};

/**
 * kick out user
 *
 */
ChatRemote.prototype.kick = function (uid, cb) {
    var self = this;
    var channelNames = this.chatService.getChannelNamesCacheByUserId(uid);
    channelNames.forEach(function (channelName) { 
        self.chatService.pushByChannel(channelName, self.appConfig.event.chatLeave, { user_id: uid, channel_name: channelName });
    })
    this.chatService.kick(uid);
    cb();
};
