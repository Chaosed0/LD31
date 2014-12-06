
define(function(require) {
    var self = this;

    var Crafty = require('crafty');
    require('scripts/Player.js');
    require('scripts/FollowMouse.js');
    require('scripts/PlayerAudio.js');
    require('scripts/FollowPlayer.js');
    require('scripts/FollowPlayerVary.js');
    require('scripts/EnemyDestroyer.js');
    require('scripts/EnemySpawner.js');
    require('scripts/Enemy.js');
    require('scripts/ProjectileThrower.js');
    require('scripts/Shuriken.js');
    
    var width = 1280;
    var height = 1024;

    Crafty.init(width, height, document.getElementById('game'));

    var pauseText = Crafty.e('2D, Canvas, Text')
            .attr({x: width/2.0, y: height/2.0, z: 1000})
            .textFont({size: '30px', weight: 'bold'});
    pauseText.visible = false;

    var resumeGameFunc;

    var init = function() {
        var player = Crafty.e('2D, Canvas, Color, FollowMouse, Collision, EnemyDestroyer, PlayerAudio, Player')
            .attr({x: width/2.0, y: height/2.0, w: 10, h: 10})
            .origin(5, 5)
            .color('black')
            .collision([-10.0, -10.0], [30.0, -10.0], [30.0, 30.0], [-10.0, 30.0])
            .checkHits('Enemy')
            .enemydestroyer();

        var enemyspawner = Crafty.e('2D, EnemySpawner')
            .attr({x:width/2.0, y: height/2.0, w: 0, h: 0});

        var scoretext = Crafty.e('2D, Canvas, Text')
            .attr({x: 0, y: 0, z: 1000})
            .textFont({size: '14px'})
            .text('Score: 0');

        var combotext = Crafty.e('2D, Canvas, Text')
            .attr({x: 0, y: 20, z: 1000})
            .textFont({size: '14px'})
            .text('Best Combo: 0');

        player.bind('Lose', function() {
            pauseGame('You have died');
            resumeGameFunc =  function() {
                var ents = Crafty('obj');
                ents.each(function() {
                    if(this !== pauseText) {
                        this.destroy();
                    }
                });
                init();
                resumeGame();
            };
            Crafty.addEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc);
        });

        player.bind('ScoreChange', function(newscore) {
            scoretext.text('Score: ' + newscore);
        });

        player.bind('BestComboChange', function(newcombo) {
            combotext.text('Best Combo: ' + newcombo);
        });
    }

    var pauseGame = function(msg) {
        Crafty.pause();
        pauseText.text(msg);
        pauseText.visible = true;
    };

    var resumeGame = resumeGameFunc = function() {
        Crafty.removeEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc);
        pauseText.visible = false;
        // This is toggle pause apparently...
        Crafty.pause();
    };

    init();
    pauseGame('Click to start');
    Crafty.addEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc);
});
