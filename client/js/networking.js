
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

		var data = {
			type: "update",
			user: user,
			player: {
				user: user,
				X: x, Y: y
			}
		};

		var dataToSend = JSON.stringify(data);
		ws.send(dataToSend);
	},

	connect: function(user, x, y, onconnected, onerror) {
		
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
					console.log(players);
					for(var i in players.length) {
						var maybePlayer = players[i];
						var player = me.game.world.getEntityByProp('name', maybePlayer.user.id);
						if(player == null || player.length == 0) {
							console.log(maybePlayer);
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
			}


			/*var players = JSON.parse(event.data);

			for (var i = players.length - 1; i >= 0; i--) {

				var playerData = players[i];
				var player = me.game.world.getEntityByProp('name', playerData.id)
				
				if(player == null || player.length == 0)
				{
					console.log("Player not found. adding: " + playerData.id);
					player = new game.PlayerEntity(playerData.X, playerData.Y, { image: "dude", spritewidth: 64, spriteheight:64 }, playerData.id, playerData.id, false);
					me.game.world.addChild(player);	
				}
				else
				{
					console.log("Player " + playerData.id + ' mov ' + playerData.X + ',' + playerData.Y);

					player[0].pos.x = playerData.X;
					player[0].pos.y = playerData.Y;

					console.log("Player " + player[0].id + ' is now at ' + player[0].posX + ',' + player[0].posY);

				}
			}*/

		};
	}
};