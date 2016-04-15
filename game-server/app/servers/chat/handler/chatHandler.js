var channelUtil = require('../../../util/channelUtil');
var logger = require('pomelo-logger').getLogger('sparxo-share-music-app');
var utils = require('../../../util/utils');
var pomelo = require('pomelo');

module.exports = function (app) {
    return new ChannelHandler(app, app.get('chatService'));
};

var ChannelHandler = function (app, chatService) {
    this.app = app;
    this.chatService = chatService;
    this.appConfig = app.get('appConfig');
    this.apnService = app.get('apnService');
};

function setContent(str) {
    str = str.replace(/<\/?[^>]*>/g, '');
    str = str.replace(/[ | ]*\n/g, '\n');
    return str.replace(/\n[\s| | ]*\r/g, '\n');
}

ChannelHandler.prototype.send = function (msg, session, next) {
    /*var fromPlayerId = session.get('playerId'), 
        fromUserId = session.uid, 
        fromPlayerName = session.get('playerName'),
        toPlayerId = msg.to_player_id, 
        toUserId = msg.to_user_id, 
        scope = msg.scope, 
        content, 
        message = setContent(msg.content), 
        channelName = getChannelName(msg), 
        code,
        self = this;
    content = {
        type: consts.NOTIFY_TYPE.CHAT,
        from_player_name: fromPlayerName, 
        from_player_id: fromPlayerId, 
        from_user_id: fromUserId, 
        content: message, 
        scope: scope, 
        from: msg.from
    };
    if (scope !== SCOPE.PRI) {
        utils.myPrint('ByChannel ~ msg = ', JSON.stringify(msg));
        utils.myPrint('ByChannel ~ scope = ', scope);
        utils.myPrint('ByChannel ~ content = ', JSON.stringify(content));
        //Need get near by player
        this.chatService.pushByChannel(channelName, this.appConfig.event.chat, content, function (err, res) {
            if (!!err) {
                logger.error(err.stack);
                code = consts.FAIL;
            }  else {
                code = consts.OK;
            }
            next(null, { code: code });
        });
    } else {
        utils.myPrint('Private ~ scope = ', scope);
        utils.myPrint('Private ~ content = ', JSON.stringify(content));
        messageDao.create(fromPlayerId, toPlayerId, message, function (err, m) {
            if (!!err) {
                return;
            }
            chatterDao.updateChattersLastMessage(fromPlayerId, toPlayerId, m);
        });
        deviceDao.getNewByPlayerIdAndType(toPlayerId, consts.DEVICE_TYPE.IPHONE, function (err, device) {
            if (!device || !!err) {
                return;
            }
            self.apnService.sendNotification(device.token, 'You have a new message!', content);
        });
        this.chatService.pushByUserId(toUserId, content, function (err, res) {
            if (err) {
                logger.error(err.stack);
                code = consts.FAIL;
            } else {
                code = consts.OK;
            }
            next(null, { code: code });
        });
    }*/
};

ChannelHandler.prototype.history = function (msg, session, next) {
   /* var self = this;
    var playerId = session.get('playerId');
    if (!playerId) {
        next(new Error('invalid request: empty player_id'), { code: consts.FAIL });
        return;
    }
    var maxTime = msg.max_time;
    if (!maxTime) {
        next(new Error('invalid request: empty max_time'), { code: consts.FAIL });
        return;
    }
    messageDao.getMessagesByPlayerId(playerId, maxTime, 20, function (err, messages) {
        if (!!err) {
            next(err, { code: consts.FAIL });
            return;
        }
        next(null, { code: consts.OK , messages: messages });
    });
    */
}

ChannelHandler.prototype.conversationHistory = function (msg, session, next) {
    /*var self = this;
    var playerId = session.get('playerId');
    if (!playerId) {
        next(new Error('invalid request: empty player_id'), { code: consts.FAIL });
        return;
    }
    var maxTime = msg.max_time;
    if (!maxTime) {
        next(new Error('invalid request: empty max_time'), { code: consts.FAIL });
        return;
    }
    var chatterId = msg.chatter_id;
    if (!chatterId) {
        next(new Error('invalid request: empty chatter_id'), { code: consts.FAIL });
        return;
    }
    messageDao.getMessagesByConversation(playerId, chatterId, maxTime, 20, function (err, messages) {
        if (!!err) {
            next(err, { code: consts.FAIL });
            return;
        }
        next(null, { code: consts.OK , messages: messages });
    });
    */
}

var getChannelName = function (msg) {
   /* var scope = msg.scope;
    if (scope === SCOPE.AREA) {
        return channelUtil.getAreaChannelName(msg.area_id);
    }
    return channelUtil.getGlobalChannelName();
    */
};
