
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("FollowPlayer", {
        _cachedplayer: null,
        _comp: 'Player',
        _speed: 3,

        _enterframe: function() {
            if(this._cachedplayer == null) {
                this._cachedplayer = Crafty(this._comp).get(0);
            }

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

        followplayer: function(comp, speed) {
            this._speed = speed;
            this._comp = comp;
            return this;
        }
    });
});
