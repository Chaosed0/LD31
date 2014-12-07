
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Enemy", {
        _special: false,
        enemy: function(special) {
            this._special = special;
        },
        isSpecialEnemy: function() {
            return this._special;
        }
    });
});
