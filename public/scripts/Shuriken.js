
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.audio.add('throw', ['audio/throw.ogg', 'audio/throw.mp3', 'audio/throw.wav']);

    Crafty.c("Shuriken", {
        _rotation: 10,
        _speed: 10,

        _movement: null,
        _target: new Vec2d(0,0),

        _enterframe: function(data) {
            if(this._movement == null) {
                var position = new Vec2d(this.x, this.y);
                this._movement = this._target.subtract(position).scaleToMagnitude(this._speed);
            }
            this.x += this._movement.x;
            this.y += this._movement.y;
            this.rotation += this._rotation;
        },

        init: function() {
            this.bind("EnterFrame", this._enterframe);
            Crafty.audio.play("throw");
        },

        shuriken: function(target) {
            this._target = target;
            return this;
        }
    });
});
