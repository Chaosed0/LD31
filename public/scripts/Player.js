
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Player", {
        _bounds: new Vec2d(0,0),

        _enterframe: function(data) {
            //Occasionally you can die while dashing, prevent it
            if(!this._dashing) {
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

        init: function() {
            this.bind('EnterFrame', this._enterframe);
        },

        player: function(stageWidth, stageHeight) {
            this._bounds = new Vec2d(stageWidth, stageHeight);
            return this;
        }
    });
});
