var express = require('express');

var app = express();
app.configure(function () {
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/public');
    app.set('view options', { layout: false });
    app.set('basepath', __dirname + '/public');
});

app.configure('development', function () {
    app.use(express.static(__dirname + '/dist'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function () {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/dist', { maxAge: oneYear }));
    app.use(express.errorHandler());
});

console.log("Web server has started.\n");
app.listen(30002, '0.0.0.0');
