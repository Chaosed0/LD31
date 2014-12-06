
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Enemy", {
        _light: true,
        _heavy: false,

        setLight: function() {
            this._light = true;
            this._heavy = false;
        },
        
        setHeavy: function() {
            this._heavy = true;
            this._light = false;
        }
    });
});
