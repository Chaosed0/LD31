
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Player", {
        _bounds: new Vec2d(0,0),
        _invincible: false,

        _enterframe: function(data) {
            if(!this._invincible) {
                var pos = this.pos();
                pos.x = pos._x;
                pos.y = pos._y;
                pos.w = pos._w;
                pos.h = pos._h;

                var q = Crafty.map.search(pos);
                for(var i = 0; i < q.length; i++) {
                    var obj = q[i];
                    if(obj !== this && obj.has('KillPlayer') && obj.intersect(pos)) {
                        this.trigger('Lose', obj);
                    }
                }
            }

            //Don't go out of bounds
            if(this.x > this._bounds.x - this.w) {
                this.x = this._bounds.x - this.w;
            } else if(this.x < 0) {
                this.x = 0;
            }

            if(this.y > this._bounds.y - this.h) {
                this.y = this._bounds.y - this.h;
            } else if(this.y < 0) {
                this.y = 0;
            }
        },

        setInvincible: function() {
            this._invincible = true;
        },

        unsetInvincible: function() {
            this._invincible = false;
        },

        init: function() {
            this.bind('EnterFrame', this._enterframe);
            this.bind('StartDash', this.setInvincible);
            this.bind('StartBomb', this.setInvincible);
            this.bind('StopDash', this.unsetInvincible);
            this.bind('StopDash', this.unsetInvincible);
        },

        player: function(stageWidth, stageHeight) {
            this._bounds = new Vec2d(stageWidth, stageHeight);
            return this;
        }
    });
});
