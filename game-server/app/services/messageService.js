var pomelo = require('pomelo');
var logger = require('pomelo-logger').getLogger('vambie-app');

var exp = module.exports;

exp.pushMessageByUids = function (uids, route, msg, cb) {
    pomelo.app.get('channelService').pushMessageByUids(route, msg, uids, cb);
};

exp.pushMessageToUser = function (uid, route, msg,cb) {
    exp.pushMessageByUids([uid], route, msg, cb);
};

function errHandler(err, fails) {
    if (!!err) {
        logger.error('Push Message error! %j', err.stack);
    }
}