var dispatcher = require('../../../util/dispatcher');
module.exports = function (app) {
    return new Handler(app);
};

var Handler = function (app) {
    this.app = app;
};

Handler.prototype = {
    queryEntry: function (msg, session, next) {
        var userName = msg.userName;
        if (!userName) {
            next(null, {
                code: 500
            });
            return;
        }
        // get all connectors
        var connectors = this.app.getServersByType('connector');
        if (!connectors || connectors.length === 0) {
            next(null, {
                code: 500
            });
            return;
        }
        // select connector
        var res = dispatcher.dispatchByString(userName, connectors);
        next(null, {
            code: 200,
            host: res.host,
            port: res.clientPort
        });
    }
};
