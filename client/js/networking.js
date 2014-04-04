
var host = location.origin.replace(/^http/, 'ws');

var ws;


var networking = {
	chat: function(user, chatMessage, onsuccess, onerror) {
		console.log("Chatting: " + user.name);

		var data = {
			type : "chat",
			user: user,
			data: chatMessage
		};

		var dataToSend = JSON.stringify(data);
		ws.send(dataToSend);
	},

	updatePlayer: function(user, x, y, onconnected, onerror) {

		var update = {
			type: "update",
			user: user,
			data: {
				user: user,
				X: x, Y: y
			}
		};

		var dataToSend = JSON.stringify(update);
		ws.send(dataToSend);
	},

	connect: function(user, x, y, onconnected, onerror) {

		var ghjk = false;

		
		ws = new WebSocket(host);
		ws.onopen = function() {

			console.log("Player: " + user.name + " trying to connect...");
			var data = {
				type : "join",
				user: user
			};

			var dataToSend = JSON.stringify(data);
			ws.send(dataToSend);
		};

		ws.onmessage = function (event) {

			var msg = JSON.parse(event.data);

			switch(msg.type) {
				case "joinResponse":
					var player = new game.PlayerEntity(960, 448, { image: "dude", spritewidth: 64, spriteheight:64 }, msg.data.name, msg.data.id, true);
					me.game.world.addChild(player);	
					onconnected(msg.data);
					break;
				case "chat":
					console.log("[CHAT] %s: %s", msg.data.user.name, msg.data.text);
					if(msg.data.user.id != "azure") {
						var players = me.game.world.getEntityByProp('name', msg.data.user.id);
						if(players.length > 0) {
							var player = players[0];
							player.speak(msg.data.text);
						}
					}
					break;
				case "updateAll":
					var players = msg.data;
					for(var n in players) {
							if(players[n]) {
								if(players[n].user) {
									if(players[n].user.id) {
										if(players[n].user.id != user.id) {
											var character = me.game.world.getEntityByProp("name", players[n].user.id);
											if(character == null || character.length == 0) {
												var newPlayer = new game.PlayerEntity(
													players[n].X, players[n].Y,
													{ image: "dude", spritewidth: 64, spriteheight: 64 },
													players[n].user.name, players[n].user.id,
													false
												);
												console.log("new player from server: %s", players[n].user.name);
												me.game.world.addChild(newPlayer);
											} else {
												character[0].pos.x = players[n].X;
												character[0].pos.y = players[n].Y;
											}
										}s
									}
								}
							}
					}
					break;
					/*for(var i in players.length) {
						var maybePlayer = players[i];
						if(maybePlayer.user.id != user.id) {
							var player = me.game.world.getEntityByProp('name', maybePlayer.user.id);
							if(player == null || player.length == 0) {
								var newPlayer = new game.PlayerEntity(
									maybePlayer.X, maybePlayer.Y,
									{ image: "dude", spritewidth: 64, spriteheight: 64 },
									maybePlayer.user.name, maybePlayer.user.id,
									false
								);
								me.game.world.addChild(newPlayer);
							} else {
								player[0].pos.x = maybePlayer.X;
								player[0].pos.y = maybePlayer.Y;
							}
						}
					}*/
			}
		};
	}
};