
define(function(require) {
    require('scripts/FollowMouse.js');
    require('scripts/FollowPlayer.js');

    var Crafty = require('crafty');
    var $ = require('jquery');

    Crafty.init(1280, 1024, $('#game')[0]);
    var player = Crafty.e('2D, Canvas, Color, FollowMouse, Collision, Player')
        .attr({x: 400, y: 300, w: 10, h: 10})
        .color('#000')
        .followmouse(8, 0.1, 0.1)
        .collision([-10.0, -10.0], [30.0, -10.0], [30.0, 30.0], [-10.0, 30.0])
        .checkHits('Enemy');

    Crafty.e('2D, Canvas, Color, FollowPlayer, Enemy')
        .attr({x: 0, y: 0, w: 10, h: 10})
        .color('red')
        .followplayer('Player', 3);
});
