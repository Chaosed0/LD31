
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.c("Meter", {
        _fillpercent: 0,
        _flashonfill: true,
        _color: '#0000FF',
        ready: true,

        _draw: function(e) {
            if(e.type == 'canvas') {
                e.ctx.fillStyle = '#000000';
                e.ctx.strokeRect(e.pos._x, e.pos._y, e.pos._w, e.pos._h);
                e.ctx.fillStyle = this._color;
                e.ctx.fillRect(e.pos._x, e.pos._y, this._fillpercent/100.0 * e.pos._w, e.pos._h);
            } else {
                e.destroy();
                console.log("Meter component doesn't support DOM!");
            }
        },

        init: function() {
            this.bind("Draw", this._draw);
            this.trigger("Invalidate");
        },

        remove: function() {
            this.unbind("Draw", this._draw);
            this.trigger("Invalidate");
        },

        meter: function(color) {
            this._color = color;
            this.trigger('Invalidate');
            return this;
        },

        fillpercent: function(fillpercent) {
            this._fillpercent = fillpercent;
            this.trigger('Invalidate');
            return this;
        }
    });
});
