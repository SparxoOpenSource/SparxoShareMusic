var logger = require('pomelo-logger').getLogger('sparxo-share-music-app');
var pomelo = require('pomelo');

module.exports = function () {
    return new Filter();
};

var Filter = function () {
};

/**
 * Studio filter
 */
Filter.prototype.before = function (msg, session, next) {
    var studio = pomelo.app.studioManager.getStudio(session.get('studioId'));
    session.studio = studio;
    var user = studio.getUser(session.get('userName'));
    
    if (!user) {
        var route = msg.__route__;
        
        if (route.search(/enterStudio$/i) >= 0) {
            next();
            return;
        } else {
            next(new Error('No user exist!'));
            return;
        }
    }

    next();
};