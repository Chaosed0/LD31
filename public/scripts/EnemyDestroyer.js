
define(function(require) {
    var Crafty = require('crafty');
    var Expires = require('Expires');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.sprite(20, 20, "image/blood.png", {bloodspray:[0, 0]});
    Crafty.sprite(20, 20, "image/slash.png", {slash:[0, 0]});

    Crafty.c("EnemyDestroyer", {
        _destroy: false,

        _score: 0,
        _combo: -1,

        _onHit: function(hitData) {
            for(var i = 0; i < hitData.length; i++) {
                var entityHit = hitData[i].obj;
                if(this._destroy) {
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

                    if(this._combo >= 0) {
                        if(this._combo > 0) { 
                            var textsize = 8 + this._combo * 4;
                            var redness = Math.min(0 + this._combo * 20, 255);
                            var rednessHex = redness.toString(16);
                            if(rednessHex.length < 2) {
                                rednessHex = '0' + rednessHex;
                            }

                            Crafty.e('2D, Canvas, Text, Expires')
                                .attr({x: entityHit.x, y: entityHit.y, w:20, h:20})
                                .textFont({size:textsize + 'px'})
                                .textColor('#' + rednessHex + '0000')
                                .text('+' + this._combo*10)
                                .expires(1000);
                            score += this._combo*10;
                        }
                        this._combo++;
                    }

                    entityHit.destroy();
                    this.trigger('EnemyKill');
                    this.trigger('ScoreChange', this._score);
                }
            }
        },

        _onMaxMove: function() {
        },

        _onStartDash: function() {
            this._destroy= true;
            this._combo = 0;
        },

        _onEndDash: function() {
            this._destroy= false;
            this._combo = -1;
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
