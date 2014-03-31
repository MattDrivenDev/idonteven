/*------------------- 
a player entity
-------------------------------- */
game.PlayerEntity = me.ObjectEntity.extend({

    /* -----

    constructor

    ------ */

    init: function (x, y, settings, name, id, isplayer) {
        // call the constructor
        this.parent(x, y, settings);

        this.name = id;

        this.isPlayer = isplayer;

        this.renderable.addAnimation("up", [0, 1]);
        this.renderable.addAnimation("down", [4,5]);
        this.renderable.addAnimation("left", [6,7]);
        this.renderable.addAnimation("right", [2, 3]);

        // set the default horizontal & vertical speed (accel vector)
        this.setVelocity(5,5);

        this.bubble = new game.SpeechBubble(this.pos.x, this.pos.y, "this is a test of a really long bit of speech. it will be lmimted to 140 characters or some such shit, who knows.");
        me.game.world.addChild(this.bubble);

        this.font = new me.Font('helvetica,arial,sans-serif','16px','#ffffff','center');

        this.z = 10;

        // set the display to follow our position on both axis
        if(isplayer) me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

        //window.playerEntity = this;
        this.playerName = name;

        this.speak("arse");
    },

    /* -----

    update the player pos

    ------ */
    update: function () {

        if (this.isPlayer) {
            if (me.input.isKeyPressed('left')) {
                // flip the sprite on horizontal axis
                //this.flipX(true);
                // update the entity velocity
                this.renderable.setCurrentAnimation("left");
                this.vel.x -= this.accel.x * me.timer.tick;
                networking.updatePlayer(this.name, this.pos.x, this.pos.y);
            } else if (me.input.isKeyPressed('right')) {
                // unflip the sprite
                //this.flipX(false);
                // update the entity velocity
                this.renderable.setCurrentAnimation("right");

                this.vel.x += this.accel.x * me.timer.tick;
                networking.updatePlayer(this.name, this.pos.x, this.pos.y);
            } else {
                this.vel.x = 0;
            }

            if (me.input.isKeyPressed('up')) {
                // flip the sprite on horizontal axis
                //this.flipX(true);
                this.renderable.setCurrentAnimation("up");
                // update the entity velocity
                this.vel.y -= this.accel.y * me.timer.tick;
                networking.updatePlayer(this.name, this.pos.x, this.pos.y);
            } else if (me.input.isKeyPressed('down')) {
                // unflip the sprite
                //this.flipX(false);
                this.renderable.setCurrentAnimation("down");
                // update the entity velocity
                this.vel.y += this.accel.y * me.timer.tick;
                networking.updatePlayer(this.name, this.pos.x, this.pos.y);
            } else {
                this.vel.y = 0;
            }
        }
        

        // check & update player movement
        this.updateMovement();

        //

        this.bubble.pos.x = this.pos.x+32;
        this.bubble.pos.y = this.pos.y-180;

        // update animation if necessary
        if (this.vel.x != 0 || this.vel.y != 0) {
            // update object animation
            this.parent();
            return true;
        }

        // else inform the engine we did not perform
        // any update (e.g. position, animation)
        return false;
    },

    draw: function (context) {
        this.font.draw(context, this.playerName, this.pos.x+32, this.pos.y - 20);
        this.parent(context);
    },

    speak: function (text) {
        this.bubble = new game.SpeechBubble(this.pos.x, this.pos.y, text);
        //this.bubble.displayTimer = 200;
        //this.bubble.visible = true;
    }

});

game.SpeechBubble = me.ObjectContainer.extend({
    
    init: function (x, y, text) {
        // call the constructor
        this.parent(x, y, 300,200);

        this.font = new me.Font('helvetica,arial,sans-serif', '16px', '#000000');

        this.z = 11;

        var spr = new me.SpriteObject(0, 0, me.loader.getImage("bubble"), 300, 200);
        //spr.floating = true;
        spr.z = 12;
        this.addChild(spr);

        this.text = text;

        this.displayTimer = 200;
        this.visible = true;

        this.alwaysUpdate = true;
    },

    update:function()
    {
        this.displayTimer -= me.timer.tick;

        if (this.displayTimer <= 0) this.visible = false;
    },

    draw: function (context) {
        this.parent(context);
        this.font.draw(context, wrapText(context, this.text, 200), this.pos.x + 32, this.pos.y + 32);
        
    }

});

function wrapText(context, text,maxWidth) {
    var words = text.split(' ');
    var lines = '';

    var line = '';
    for (var n = 0; n < words.length; n++) {
        line += words[n] + ' ';
        var metrics = context.measureText(line);
        var testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines += line + "\n";
            line = '';
        }
        else {
            //lines += line;
        }
        
    }
    lines += line;
    return (lines);
}
