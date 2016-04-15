var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('sparxo-share-music-app');

module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
    if (!this.app)
        logger.error(app);
};

var pro = Handler.prototype;

pro.enter = function (msg, session, next) {
    var self = this;
    var userName = msg.userName;
    var sessionService = self.app.get('sessionService');

    //duplicate log in
    if (!!sessionService.getByUid(userName)) {
        next(null, {
            code: 500,
            error: true
        });
        return;
    }
    
    var studioId = 1;
    session.set('serverId', self.app.get('studioIdMap')[studioId]);
    session.set('studioId', studioId);
    session.set('userName', userName);
    session.pushAll(function (err) {
        if (err) {
            next(err, { code: 500 });
            return;
        }
    });
    session.bind(userName);
    session.on('closed', onUserLeave.bind(null, self.app));
    next(null, { code: 200 });
};

var onUserLeave = function (app, session, reason) {
    if (!session || !session.userName) {
        return;
    }

    app.rpc.studio.studioRemote.userLeave(session, { userName: session.get('userName'), studioId: session.get('studioId') }, function (err) {
        if (!!err) {
            logger.error('user leave error! %j', err);
        }
    });
};
