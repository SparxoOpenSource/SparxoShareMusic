const config = require('../config');
const app = require('../server/main');
const ws = require('../server/ws');
const opn = require("opn");
const debug = require('debug')('app:bin:server');
const port = config.server_port
var server = app.listen(port, function (err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port

    if (process.env.NODE_ENV !== 'testing') {
        opn(uri)
    }
});

ws(server);

debug(`Server is now running at http://localhost:${port}.`)
