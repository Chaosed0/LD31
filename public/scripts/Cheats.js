
//What get out of here
//just because it is named cheats.js doesn't mean there is anything in here
//... okay, fine, just use them responsibly

define(function(require) {
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
});
