var requireNoCache = function (path) {
    var cache = require.cache;
    delete cache[require.resolve(path)];
    return require(path);
}

var count = 0;
var testClient = function () {
    this.pomelo = requireNoCache('./client');
    this.uid = new Date().valueOf() + "jsdogfajsdghjadoiu";
}
testClient.prototype = {
    test: function () {
        var _this = this;
         this.pomelo.init({
            host: '127.0.0.1',
            port: 3014,
            log: false
         }, function () {
            _this.pomelo.request("gate.gateHandler.queryEntry", { uid: _this.uid }, function (data) {
                //console.log(_this.uid + "|" + data.port);
                _this.pomelo.disconnect();
                _this.join(data.host, data.port);
            });
        });
    },
    join: function (host, port) {
        var _this = this;
        this.pomelo.init({
            host: host,
            port: port,
            log: false
        }, function () {
            _this.pomelo.request("connector.entryHandler.enter", { username: _this.uid, rid: 'zzz' }, function (data) {
                for (var i = 0; i < 10000; i++) {
                    _this.pomelo.request('chat.chatHandler.send', { rid: 'zzz', content: '123456', from: _this.uid, target: '*' }, function (data) {
                        
                    });
                }
            });
        });
    }
}

for (var i = 0; i < 1; i++) {
    var t = new testClient();
    t.test();
}

console.log('fine.');