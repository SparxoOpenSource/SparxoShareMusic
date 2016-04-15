var exp = module.exports;
var dispatcher = require('./dispatcher');

exp.chat = function(session, msg, app, cb) {
	var chatServers = app.getServersByType('chat');

	if(!chatServers || chatServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	var res = dispatcher.dispatchByString(session.get('rid'), chatServers);

	cb(null, res.id);
};

exp.studio = function (session, msg, app, cb) {
    var serverId = session;
    if (typeof (session) == 'object') {
        serverId = session.get('serverId');
    }
    if (!serverId) {
        cb(new Error('can not find server info for type: ' + msg.serverType));
        return;
    }
    
    cb(null, serverId);
};

exp.connector = function (session, msg, app, cb) {
    if (!session) {
        cb(new Error('fail to route to connector server for session is empty'));
        return;
    }
    
    if (!session.frontendId) {
        cb(new Error('fail to find frontend id in session'));
        return;
    }
    
    cb(null, session.frontendId);
};