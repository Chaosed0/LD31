
define(function(require) {
    var Crafty = require('crafty');
    var $ = require('jquery');

    Crafty.init(800, 600, $('#game')[0]);
    Crafty.e('2D, DOM, Color, Twoway, Gravity')
        .attr({x: 0, y: 0, w: 100, h: 100})
        .color('#F00')
        .twoway(4, 5)
        .gravity('Floor');

    Crafty.e('Floor, 2D, Canvas, Color')
        .attr({x: 0, y: 250, w: 250, h: 10})
        .color('green');
});
