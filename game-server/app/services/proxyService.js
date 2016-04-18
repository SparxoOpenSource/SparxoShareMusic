var request = require('request');

var exp = module.exports;

exp.getIp = function (cb) {
    request.get('http://qsrdk.daili666api.com/ip/?tid=559363448106627&num=1&foreign=none', function (err, response, body) {
        if (!err && response.statusCode == 200) {
            if (!body) {
                return cb('get proxy ip error! ');
            }
            cb(null, 'http://' + body);
        } else {
            return cb('can not get proxy ip! ');
        }
    });
};