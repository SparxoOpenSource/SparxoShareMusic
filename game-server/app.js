var pomelo = require('pomelo');
var scene = require('./app/domain/studio/scene');
var routeUtil = require('./app/util/routeUtil');
var userFilter = require('./app/servers/studio/filter/userFilter');
var ChatService = require('./app/services/chatService');

/**
 * Init app for client.
 */
var app = pomelo.createApp();
app.set('name', 'SparxoShareMusic');
app.set('proxyConfig', {
    timeout: 1000 * 10
});

// app configure
app.configure('production|development', function () {
	if (app.serverType !== 'master') {
        var studios = app.get('servers').studio;
        var studioIdMap = {};
        for (var id in studios) {
            studioIdMap[studios[id].studioId] = studios[id].id;
        }
        app.set('studioIdMap', studioIdMap);
    }

    // route configures
    app.route('chat', routeUtil.chat);
    app.route('studio', routeUtil.studio);

    //load config
        app.loadConfig('appConfig', app.getBase() + '/config/' + app.get('env') + '/appConfig.json');

    // filter configures
    app.filter(pomelo.timeout());
});

app.configure('production|development', 'connector', function () {
	app.set('connectorConfig',
		{
			connector: pomelo.connectors.hybridconnector,
			heartbeat: 3,
			useDict: true,
			useProtobuf: true
		});
});

app.configure('production|development', 'gate', function () {
    app.set('connectorConfig',
		{
			connector: pomelo.connectors.hybridconnector,
			useProtobuf: true
		});
});

app.configure('production|development', 'studio', function () {
    //app.filter(pomelo.filters.serial());
    app.before(userFilter());

    var studioId = app.curServer.studioId;
    if (!studioId || studioId < 0) {
        throw new Error('load studio config failed');
    }
    scene.init({ id: studioId });
    app.studioManager = scene;
});

/*app.configure('production|development', 'chat', function () {
    app.before(messageFilter());
    app.set('chatService', new ChatService(app));
});*/

// start app
app.start(function () {
});


process.on('uncaughtException', function (err) {
	console.error(' Caught exception: ' + err.stack);
});