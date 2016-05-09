var request = require('request');

var exp = module.exports;

exp.getIp = function (cb) {
    request.get('http://qsrdk.daili666api.com/ip/?tid=556792504942537&num=1&operator=1&delay=1&foreign=none&ports=80', function (err, response, body) {
        if (!err && response.statusCode == 200) {
            if (!body) {
                return cb('get proxy ip error! ');
            }
            cb(null, 'http://' + body.split('\r\n')[0]);
        } else {
            return cb('can not get proxy ip! ');
        }
    });
};