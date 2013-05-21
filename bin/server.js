var EJS = require('ejs');
var Express = require('express');
var HTTP = require('http');
var IO = require('socket.io');
var Path = require('path');

var app = Express();
var server = HTTP.createServer(app);

var io = IO.listen(server);
io.set('log level', 1);

app.engine('html', EJS.renderFile);
app.set('views', Path.resolve(__dirname, "../view"));

app.use(Express.bodyParser());
app.use(Express.logger());
app.use(app.router);
app.use(Express.static(Path.join(__dirname, "../resource")));

var modules = require('../lib/control/modules').load(app, io, Path.resolve(__dirname, '../modules'));
require('../lib/control/view').create(app, modules);

server.listen(8980, function() {
	console.log("Listening for clients on 8980");
});
