var socketServer = require("ws").Server,
	http = require("http"),
	express = require("express"),
	app = express(),
	port = process.env.PORT || 1337;

app.use(express.static(__dirname + "/"));
var server = http.createServer(app);
server.listen(port);

var ws = new socketServer({ server: server });

ws.on("connection", function(socket) {


	// Server pings...
	var interval = 60000;
	setInterval(function() {
		var msg = { 
			name: "Azure",
			text: "ping..." 
		};
		socket.send(JSON.stringify(msg));
	}, interval);

});