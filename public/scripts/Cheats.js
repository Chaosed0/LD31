
//What get out of here
//just because it is named cheats.js doesn't mean there is anything in here
//... okay, fine, just use them responsibly

define(function(require) {
    var Crafty = require('crafty');

    window.bennyhill = function() {
        var playonadd = Crafty.audio.isPlaying('bgmusic');
        Crafty.audio.remove('bgmusic');
        Crafty.audio.add('bgmusic',
                ['http://archive.org/download/BennyHillYaketySax/MusicaDeCirco-BennyHill.mp3',
                 'http://archive.org/download/BennyHillYaketySax/MusicaDeCirco-BennyHill.ogg']);
        if(playonadd) {
            Crafty.audio.play('bgmusic');
        }
    };

    window.getbomb = function() {
        Crafty('EnemyDestroyer').get(0)._increasebombmeter(999);
    };

    window.godmode = function() {
        //This is why I love crafty; it lets you put stuff in their proper places,
        // but it also lets you stomp all over those places when need be.
        Crafty('Player').get(0).bind('EnterFrame', function() {
            this._invincible = true;
        });
    }
});
