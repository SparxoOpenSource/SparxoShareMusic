var logger = require('pomelo-logger').getLogger('sparxo-share-music-app');
var pomelo = require('pomelo');

module.exports = function () {
    return new Filter();
};

var Filter = function () {
    this.userRecords = {};
};

/**
 * Message filter
 */
Filter.prototype.before = function (msg, session, next) {
    var self = this;
    var route = msg.__route__;
    if (route.search(/send$/i) >= 0) {
        if (!msg.content) {
            next(new Error('invaild request: empty content'), { code: 500 });
            return;
        }
    }
    next();
};