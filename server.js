var socketServer = require("ws").Server,
	http = require("http"),
	express = require("express"),
	app = express(),
	port = process.ENV.PORT || 1337;

app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
server.listen(port);

var ws = new socketServer({ server: server });

ws.on("connection", function(socket) {
	var interval = 1000;
	setInterval(function() {
		socket.send("Hello World!");
	}, interval);
});