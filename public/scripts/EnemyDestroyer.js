
define(function(require) {
    var Crafty = require('crafty');
    var Expires = require('Expires');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.sprite(20, 20, "image/blood.png", {bloodspray:[0, 0]});
    Crafty.sprite(20, 20, "image/slash.png", {slash:[0, 0]});

    Crafty.c("EnemyDestroyer", {
        _destroylight: false,
        _destroyheavy: false,

        _score: 0,

        _onHit: function(hitData) {
            for(var i = 0; i < hitData.length; i++) {
                var entityHit = hitData[i].obj;
                if((entityHit._light && this._destroylight) ||
                    entityHit._heavy && this._destroyheavy) {
                    var score;

                    if(entityHit._light) {
                        score = 10;
                    } else {
                        score = 50;
                    }

                    this._score += score;
                    
                    var slashimg = Crafty.e('2D, Canvas, slash, SpriteAnimation, Expires')
                        .attr({x: entityHit.x + 10, y: entityHit.y+10, w:20, h:20})
                        .reel('slash', 50, 0, 0, 5)
                        .animate('slash')
                        .expires(100)
                        .origin(10, 10);
                    var bloodsprite = Crafty.e('2D, Canvas, bloodspray, SpriteAnimation')
                        .attr({x: entityHit.x + 10, y: entityHit.y + 10, w:20, h:20})
                        .reel('spray', 100, 0, 0, 5)
                        .animate('spray')
                        .origin(10, 10);

                    slashimg.rotation = this.rotation + 90;
                    bloodsprite.rotation = this.rotation + 90;

                    entityHit.destroy();
                    this.trigger('EnemyKill');
                }
            }
        },

        _onMaxMove: function() {
            this._destroylight = true;
        },

        _onStartDash: function() {
            this._destroyheavy = true;
        },

        _onEndDash: function() {
            this._destroylight = false;
            this._destroyheavy = false;
        },

        init: function() {
            this.onHit('Enemy', this._onHit);
            //this.bind("HitOn", this._onHit);
            this.bind("HitMaxSpeed", this._onMaxMove);
            this.bind("StartDash", this._onStartDash);
            this.bind("StopDash", this._onEndDash);
        },

        enemydestroyer: function() {
            return this;
        }
    });
});
