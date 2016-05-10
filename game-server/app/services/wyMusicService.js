var request = require('request');

var exp = module.exports;

exp.getMusicByUrl = function (url, proxyIp, cb) {
    if (!this.match(url)) {
        cb('error url! ');
        return;
    }
    //http://music.163.com/#/song?id=208927
    var id = url.split("id=")[1];
    if (!id) {
        ///http://music.163.com/#/song/4280207/
        id = url.match(/song\/(\d+)/)
        if (!id) {
            cb('error url! ');
            return;
        }
        id = id[1]
    }
    return this.getMusicById(id, proxyIp, cb);
}

exp.getMusicById = function (id, proxyIp, cb) {
    var musicUrl = 'http://music.163.com/api/song/detail?id=' + id + '&ids=[' + id + ']';
    var options = {
        url: musicUrl,
        headers: {
            Referer: "http://music.163.com/",
            Cookie: "appver=1.5.0.75771"
        }
    };
    if (proxyIp) {
        options.proxy = proxyIp;
    }
    request(options, function (err, response, body) {
        if (!err && response.statusCode == 200) {
            var data = JSON.parse(body);
            var song = data.songs[0];
            if (!song) {
                console.log(body);
                cb('request music error! ');
                return;
            }
            var artists = [];
            for (var n in song.artists) {
                artists.push(song.artists[n].name);
            }
            cb(null, {
                id: song.id,
                name: song.name,
                artists: artists,
                album: song.album.name,
                image: song.album.picUrl,
                resourceUrl: song.mp3Url
            });
        }
        else {
            console.error('request music error! ');
            console.error(err);
            cb('request music error! ');
            return;
        }
    });
}



exp.match = function (url) {
    return /music.163.com/.test(url);
}
