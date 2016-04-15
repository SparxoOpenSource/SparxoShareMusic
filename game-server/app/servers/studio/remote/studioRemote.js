var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('sparxo-share-music-app');
var utils = require('../../../util/utils');

module.exports = function(app) {
	return new StudioRemote(app);
};

var StudioRemote = function(app) {
	this.app = app;
};

StudioRemote.prototype.userLeave = function (args, cb) {
    var userName = args.userName;
    var studio = pomelo.app.studioManager.getStudio();
    var user = studio.getUser(userName);
    utils.myPrint('~~~ user leave');
    utils.myPrint('1 ~ studioId = ', studio.studioId);
    if (!user) {
        logger.warn('user not in the studio ! %j', args);
        utils.invokeCallback(cb, new Error('user[' + userName + '] not in the studio !'));
        return;
    }
    studio.removeUser(userName);
    studio.channel.pushMessage({ route: 'onUserLeave', code: 200, userName: userName });
    utils.invokeCallback(cb);
};