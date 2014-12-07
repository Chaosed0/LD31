
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("HeavyEnemy", {
        _cachedplayer: null,
        _comp: 'Player',
        _speed: 1,
        _maxspeed: 8.5,
        _acceleration: 0.02,

        _enterframe: function() {
            if(this._cachedplayer == null) {
                this._cachedplayer = Crafty(this._comp).get(0);
            }

            this._speed += this._acceleration;
            if(this._speed >= this._maxspeed) {
                this._speed = this._maxspeed;
            }

            var redness = this._speed / this._maxspeed * 255;
            var rednessHex = Math.floor(redness).toString(16);
            if(rednessHex.length < 2) {
                rednessHex = '0' + rednessHex;
            }
            this.color('#' + rednessHex + '0000');

            var target = new Vec2d(this._cachedplayer.x, this._cachedplayer.y);
            var position = new Vec2d(this.x, this.y);
            var movement = target.clone().subtract(position).scaleToMagnitude(this._speed);
            this.x += movement.x;
            this.y += movement.y;
            this.trigger('Moved', {x: this.x - movement.x, y: this.y - movement.y});
        },

        init: function() {
            this.bind("EnterFrame", this._enterframe);
        },

        heavyenemy: function(comp, speed, maxspeed, acceleration) {
            this._maxspeed = maxspeed;
            this._speed = speed;
            this._comp = comp;
            this._acceleration = acceleration;
            return this;
        }
    });
});
