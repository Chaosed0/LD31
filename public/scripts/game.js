
define(function(require) {
    var self = this;

    var Crafty = require('crafty');

    require('scripts/Player.js');
    require('scripts/PlayerAudio.js');
    require('scripts/PlayerControl.js');

    require('scripts/Enemy.js');
    require('scripts/SimpleEnemy.js');
    require('scripts/HeavyEnemy.js');
    require('scripts/ThrowerEnemy.js');
    require('scripts/Shuriken.js');

    require('scripts/EnemyDestroyer.js');
    require('scripts/EnemySpawner.js');

    require('scripts/Meter.js');
    
    var width = 1024;
    var height = 800;

    var resumeGameFunc;
    var playbgmusic = true;
    var bgmusicvol = 0.5;
    var gameElem = document.getElementById('game');

    Crafty.init(width, height, gameElem);
    Crafty.background('#EFEFEF');
    Crafty.audio.add('bgmusic', ['audio/squares_nointro.wav',
                    'audio/squares_nointro.mp3',
                    'audio/squares_nointro.ogg']);
    document.addEventListener('keypress', function(e) {
        if(e.key == 'm') {
            playbgmusic = false;
            Crafty.audio.stop('bgmusic');
        }
    });

    var pauseText = Crafty.e('2D, Canvas, Text')
            .attr({x: width/2.0 - 100, y: height/2.0 - 15, z: 1000})
            .textFont({size: '30px', weight: 'bold'});
    pauseText.visible = false;

    var init = function() {
        var bestcombo = 0;

        var player = Crafty.e('2D, Canvas, Color, PlayerControl, Collision, EnemyDestroyer, PlayerAudio, Player')
            .attr({x: width/2.0, y: height/2.0, w: 10, h: 10})
            .origin(5, 5)
            .color('black')
            .collision([-10.0, -10.0], [30.0, -10.0], [30.0, 30.0], [-10.0, 30.0])
            .checkHits('Enemy')
            .player(width, height)
            .enemydestroyer();

        var enemyspawner = Crafty.e('2D, EnemySpawner')
            .attr({x:0, y: 0, w: width, h: height});

        var scoretext = Crafty.e('2D, Canvas, Text')
            .attr({x: 0, y: 0, z: 1000})
            .textFont({size: '14px'})
            .text('Score: 0');

        var combotext = Crafty.e('2D, Canvas, Text')
            .attr({x: 0, y: 20, z: 1000})
            .textFont({size: '14px'})
            .text('Best Combo: 0');

        var combometer = Crafty.e('2D, Canvas, Meter')
            .attr({x: width - 105, y: 5, w: 100, h: 20, z: 1000})
            .meter('#0000FF');

        player.bind('Lose', function() {
            Crafty.audio.stop('bgmusic');
            pauseGame('You have died.');
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
            setTimeout(function() {
                //Often, the player will immediately click trying to dodge death,
                // causing unintended game restart - hack around it
                Crafty.addEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc)
            }, 100);
        });

        player.bind('ScoreChange', function(newscore) {
            scoretext.text('Score: ' + newscore);
        });

        player.bind('NewCombo', function(newcombo) {
            if(newcombo > bestcombo) {
                bestcombo = newcombo;
            }
            combotext.text('Best Combo: ' + bestcombo);
        });

        player.bind('NewMeter', function(newmeter) {
            combometer.fillpercent(newmeter);
        });
    }

    var pauseGame = function(msg) {
        pauseText.text(msg);
        pauseText.visible = true;
        Crafty.pause();
    };

    var resumeGame = resumeGameFunc = function() {
        Crafty.removeEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc);
        if(playbgmusic) {
            Crafty.audio.play('bgmusic', -1, bgmusicvol);
        }
        pauseText.visible = false;
        // This is toggle pause apparently...
        Crafty.pause();
    };

    init();
    pauseText.text("Click to start");
    pauseText.visible = true;
    //Sometimes, the game doesn't even render one frame before pausing
    Crafty.timer.step();
    Crafty.pause();
    Crafty.addEvent(self, Crafty.stage.elem, "mousedown", resumeGameFunc);
});
