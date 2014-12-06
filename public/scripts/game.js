
define(function(require) {
    require('scripts/FollowMouse.js');

    var Crafty = require('crafty');
    var $ = require('jquery');

    Crafty.init(1280, 1024, $('#game')[0]);
    Crafty.e('2D, DOM, Color, FollowMouse')
        .attr({x: 400, y: 300, w: 10, h: 10})
        .color('#F00')
        .followmouse(8, 0.1, 0.1);

    Crafty.e('2D, DOM, Color')
        .attr({x: 0, y: 0, w: 10, h: 10})
        .color('green');
});
