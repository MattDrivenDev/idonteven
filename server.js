var socketServer = require("ws").Server,
	http = require("http"),
	express = require("express"),
	app = express(),
	port = process.env.PORT || 1337;

app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
server.listen(port);

var ws = new socketServer({ server: server });

// Server pings...
ws.on("connection", function(socket) {
	var interval = 60000;
	setInterval(function() {
		var msg = { 
			name: "Azure",
			text: "ping..." 
		};
		socket.send(JSON.stringify(msg));
	}, interval);
});

// Echo messages...s
ws.on("message", function(data, flags) {
	var msg = JSON.parse(data);
	var echo = {
		name: "echo '" + msg.name + "'",
		text: msg.text
	};
	socket.send(JSON.stringify(echo));
});