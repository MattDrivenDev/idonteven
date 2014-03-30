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

	logger.info("New connection.");

	// Pings...
	setInterval(function() { ws.ping(socket); }, 30000);

	// Echo messages...
	socket.on("message", function(data) { ws.broadcast(JSON.parse(data)); });

});

ws.broadcast = function(msg) {
	logger.info("Broadcasting user message...");
	for(var i in this.clients)
		this.clients[i].send(JSON.stringify(msg));
};

ws.ping = function(socket) {
	logger.info("Ping!");
	socket.send(JSON.stringify({
		name: "Azure",
		text: "ping..."
	}));
};