var socketServer = require("ws").Server,
	http = require("http"),
	express = require("express"),
	app = express(),
	logger = require("./logger"),
	port = process.env.PORT || 1337;

app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
server.listen(port);

var ws = new socketServer({ server: server });

ws.on("connection", function(socket) {

	// Pings...
	var interval = 10000;
	setInterval(function() {
		logger.info("Ping!")
		var msg = { 
			name: "Azure",
			text: "ping..." 
		};
		socket.send(JSON.stringify(msg));
	}, interval);

	// Echo messages...
	socket.on("message", function(data) {
		logger.info("Message received.")
		var msg = JSON.parse(data);
		socket.send(JSON.stringify(msg));
	});

});