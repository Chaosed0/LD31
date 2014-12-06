
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Player", {

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
        },

        init: function() {
            this.bind('EnterFrame', this._enterframe);
        }
    });
});
