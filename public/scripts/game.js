
define(function(require) {
    var Crafty = require('crafty');
    var $ = require('jquery');

    require('scripts/FollowMouse.js');
    require('scripts/PlayerAudio.js');
    require('scripts/FollowPlayer.js');
    require('scripts/FollowPlayerVary.js');
    require('scripts/EnemyDestroyer.js');
    require('scripts/EnemySpawner.js');
    require('scripts/Enemy.js');
    
    var width = 1280;
    var height = 1024;

    Crafty.init(width, height, $('#game')[0]);
    var player = Crafty.e('2D, Canvas, Color, FollowMouse, Collision, EnemyDestroyer, PlayerAudio, Player')
        .attr({x: width/2.0, y: height/2.0, w: 10, h: 10})
        .origin(5, 5)
        .color('black')
        .followmouse(8, 0.1, 0.2)
        .collision([-10.0, -10.0], [30.0, -10.0], [30.0, 30.0], [-10.0, 30.0])
        .checkHits('Enemy')
        .enemydestroyer();

    var enemyspawner = Crafty.e('2D, EnemySpawner')
        .attr({x:width/2.0, y: height/2.0, w: 0, h: 0})
        .enemyspawner(500, 2000, height/2.0, 0.7);
});
