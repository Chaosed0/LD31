
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;
    var pi = 3.14159;

    var state = {
        startDash: 0,
        dashing: 1,
        preThrow: 2,
        postThrow: 3
    };

    Crafty.c("ProjectileThrower", {
        _lastProjectile: 0,

        _state: state.startDash,
        _timer: 1000,
        _speed: 0,
        _dashspeed: 15,
        _deceleration: 2,
        _comp: 'Player',

        _cachedplayer: null,
        _target: null,

        _prethrowtime: 1500,
        _postthrowtime: 500,

        _enterframe: function(data) {
            if(this._cachedplayer == null) {
                this._cachedplayer = Crafty(this._comp).get(0);
            }

            if(this._state == state.startDash) {
                this._target = new Vec2d(this._cachedplayer.x, this._cachedplayer.y);
                this._speed = this._dashspeed;
                this._state = state.dashing;
            } else if(this._state == state.dashing) {
                var position = new Vec2d(this.x, this.y);
                var movement = this._target.clone().subtract(position).scaleToMagnitude(this._speed);
                this.x += movement.x;
                this.y += movement.y;

                this._speed -= this._deceleration;

                if(this._speed <= 0) {
                    this._state = state.preThrow;
                }
            } else if(this._state == state.preThrow) {
                this._timer += data.dt;
                if(this._timer >= this._prethrowtime) {
                    this._timer -= this._prethrowtime;
                    var target = new Vec2d(this._cachedplayer.x, this._cachedplayer.y);
                    Crafty.e('2D, Canvas, Color, Shuriken, KillPlayer, Expires')
                        .attr({x: this.x, y: this.y, w: 8, h: 8})
                        .origin(4, 4)
                        .color('red')
                        .shuriken(target)
                        .expires(5000);
                    this._state = state.postThrow;
                }
            } else if(this._state == state.postThrow) {
                this._timer += data.dt;
                if(this._timer >= this._postthrowtime) {
                    this._timer = 0;
                    this._state = state.startDash;
                }
            } else {
                console.log('PANIC');
                this._state = state.startDash;
            }
        },

        init: function() {
            this.bind("EnterFrame", this._enterframe);
        },

        projectilethrower: function(comp, speed) {
            this._comp = comp;
            this._dashspeed = speed;
            return this;
        }
    });
});
