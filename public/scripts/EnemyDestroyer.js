
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;


    Crafty.c("EnemyDestroyer", {
        _destroylight: false,
        _destroyheavy: false,

        _onHit: function(hitData) {
            for(var i = 0; i < hitData.length; i++) { var entityHit = hitData[i].obj;
                if((entityHit._light && this._destroylight) ||
                    entityHit._heavy && this._destroyheavy) {
                    entityHit.destroy();
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
            this.bind("HitOn", this._onHit);
            this.bind("HitMaxSpeed", this._onMaxMove);
            this.bind("StartDash", this._onStartDash);
            this.bind("StopDash", this._onEndDash);
        },

        enemydestroyer: function() {
            return this;
        }
    });
});
