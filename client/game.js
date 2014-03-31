var game = {

	data: {
		score: 0
	},

	onload: function() {
		if(!me.video.init("screen", 960, 640, true)) {
			alert("Your browser does not support the html 5 canves.");
			return;
		}
		if(document.location.hash === "#debug") {
			window.onReady(function() {
				me.plugin.register.defer(debugPanel, "debug");
			});
		}
		me.audio.init("mp3,ogg");
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(game.resources);
		me.state.change(me.state.LOADING);
	},

	loaded: function() {
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		me.entityPool.add("dude", game.PlayerEntity);
		me.input.bindKey(me.input.KEY.LEFT, "left");
		me.input.bindKey(me.input.KEY.UP, "up");
		me.input.bindKey(me.input.KEY.RIGHT, "right");
		me.input.bindKey(me.input.KEY.DOWN, "down");
		me.state.change(me.state.PLAY);
	}

};