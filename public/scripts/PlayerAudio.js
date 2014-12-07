
define(function(require) {
    var Crafty = require('crafty');

    Crafty.audio.add({
        whoosh:    ['audio/whoosh.wav',
                    'audio/whoosh.mp3',
                    'audio/whoosh.ogg'],
        slash1:    ['audio/slash1.wav',
                    'audio/slash1.mp3',
                    'audio/slash1.ogg'],
        slash2:    ['audio/slash2.wav',
                    'audio/slash2.mp3',
                    'audio/slash2.ogg'],
        slash3:    ['audio/slash3.wav',
                    'audio/slash3.mp3',
                    'audio/slash3.ogg'],
        slash5:    ['audio/sworddraw.wav',
                    'audio/sworddraw.mp3',
                    'audio/sworddraw.ogg'],
    });

    Crafty.c("PlayerAudio", {
        _onEnemyKill: function() {
            var slashnum = Math.floor(Math.random() * 4) + 1
            Crafty.audio.play('slash' + slashnum);
        },

        _onMaxMove: function() {
            //Crafty.audio.play('sworddraw');
        },

        _onStartDash: function() {
            Crafty.audio.play('whoosh');
        },

        _onBombKill: function() {
            //EnemyKill is also triggered, so we don't need to play slash
            Crafty.audio.play('whoosh');
        },

        _onEndDash: function() {
            //Crafty.audio.play('swordaway');
        },

        init: function() {
            this.bind('EnemyKill', this._onEnemyKill);
            this.bind("HitMaxSpeed", this._onMaxMove);
            this.bind("StartDash", this._onStartDash);
            this.bind("BombKill", this._onBombKill);
            this.bind("StopDash", this._onEndDash);
        },
    });
});
