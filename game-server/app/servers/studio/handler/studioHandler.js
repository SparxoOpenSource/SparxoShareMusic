var utils = require('../../../util/utils');

module.exports = function (app) {
	return new Handler(app);
};

var Handler = function (app) {
	this.app = app;
};

var handler = Handler.prototype;


handler.enterStudio = function (msg, session, next) {
	var studio = session.studio;
	var studioId = session.get('studioId');
    var userName = session.get('userName');
	var user = { name: userName, serverId: session.frontendId };
	utils.myPrint("1 ~ EnterScene: studioId = ", studioId);
    utils.myPrint("1 ~ EnterScene: userName = ", userName);
	studio.addUser(user);
    next(null, { code: 200, playerMusicList: studio.getPlayerMusicList(), playingSong: studio.getPlayingSong() });
};

handler.getPlayerMusicList = function (msg, session, next) {
    var studio = session.studio;
	var studioId = session.get('studioId');
    var userName = session.get('userName');
    next(null, { code: 200, playerMusicList: studio.getPlayerMusicList(), playingSong: studio.getPlayingSong() });
};

handler.addMusic = function (msg, session, next) {
	var studio = session.studio;
    var userName = session.get('userName');
	var musicUrl = msg.url;
	if (!msg.url) {
		next(null, { code: 500, msg: 'need music url! ' });
		return;
	}
	studio.addMusic(musicUrl, userName, function (err) {
		if (!!err) {
			next(null, { code: 500 });
			return;
		}
		next(null, { code: 200 });
	});
};

handler.removeMusic = function (msg, session, next) {
	var studio = session.studio;
	var musicId = msg.id;
	if (!msg.id) {
		next(null, { code: 500, msg: 'need music id! ' });
		return;
	}
	studio.removeMusic(musicId, function (err) {
		if (!!err) {
			next(null, { code: 500 });
		}
		next(null, { code: 200 });
	});
};

handler.playMusic = function (msg, session, next) {
	var studio = session.studio;
	var musicId = msg.id;
	if (!msg.id) {
		next(null, { code: 500, msg: 'need music id! ' });
		return;
	}
	studio.playMusic(musicId, function (err) {
		if (!!err) {
			next(null, { code: 500 });
		}
		next(null, { code: 200 });
	});
};

handler.importMusic = function (msg, session, next) {
	var studio = session.studio;
    var userName = session.get('userName');
	var list = msg;
	if (!list) {
		next(null, { code: 500, msg: 'need music list! ' });
		return;
	}	
	studio.importMusic(list, userName, function (err) {
		if (!!err) {
			next(null, { code: 500 });
			return;
		}
		next(null, { code: 200 });
	});
}


