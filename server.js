var socketServer = require("ws").Server,
	http = require("http"),
	express = require("express"),
	app = express(),
	guids = require("./guids"),
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
	socket.on("message", function(rawMessage) { 
		var message = JSON.parse(rawMessage);
		logger.info(message);
		switch(message.type) {
			case "chat":
				ws.broadcast(message.user, message.data);
				break;
			case "join":
				ws.register(socket, message.user);
				break;
		} 
	});

});

ws.broadcast = function(user, msg) {
	logger.info("Broadcasting user message...");
	for(var i in this.clients) {
		this.clients[i].send(JSON.stringify({
			type: "chat",
			data: {
				name: user.name,
				text: msg
			}
		}));
	}
};

ws.ping = function(socket) {
	logger.info("Ping!");
	socket.send(JSON.stringify({
		type: "chat",
		data: {
			name: "Azure",
			text: "ping..."
		}
	}));
};

ws.register = function(socket, user) {
	logger.info("Registering new user '" + user.name + "'.");
	socket.send(JSON.stringify({
		type: "joinResponse",
		data: {
			id: guids.guid(),
			name: user.name
		}
	}));
};