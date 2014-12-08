
// What
// no
// get out of here
// nothing to see here
// go away
// pls
// don't look
// why are you debugging my game anyway
// maybe you're not debugging my game
// I don't know
// how did you even get here then
// are you some psionic genie
// are you just really good at guessing URLs
// you're probably looking in the debugger
// oh well
// I can't stop you
// go on

define(function(require) {
    var Crafty = require('crafty');

    window.getbomb = function() {
        Crafty('EnemyDestroyer').get(0)._increasebombmeter(999);
    };

    window.godmode = function() {
        //This is why I love crafty; it lets you put stuff in their proper places,
        // but it also lets you stomp all over those places when need be.
        Crafty('Player').get(0).bind('EnterFrame', function() {
            this._invincible = true;
        });
    };

    window.setspawnrate = function(spawntime) {
        Crafty('EnemySpawner').get(0).bind('EnterFrame', function() {
            this._time = spawntime;
        });
    };

    window.funmode = function() {
        var playonadd = Crafty.audio.isPlaying('bgmusic');
        Crafty.audio.remove('bgmusic');
        Crafty.audio.add('bgmusic',
                ['http://archive.org/download/BennyHillYaketySax/MusicaDeCirco-BennyHill.mp3',
                 'http://archive.org/download/BennyHillYaketySax/MusicaDeCirco-BennyHill.ogg']);
        if(playonadd) {
            Crafty.audio.play('bgmusic');
        }
    };
});
