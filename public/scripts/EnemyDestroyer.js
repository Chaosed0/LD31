
define(function(require) {
    var Crafty = require('crafty');
    var Expires = require('Expires');
    var Vec2d = Crafty.math.Vector2D;

    Crafty.sprite(20, 20, "image/blood.png", {bloodspray:[0, 0]});
    Crafty.sprite(20, 20, "image/slash.png", {slash:[0, 0]});

    var bombmeter_max = 40;
    var special_combo_val = 50;
    var normal_combo_val = 10;

    Crafty.c("EnemyDestroyer", {
        _destroy: false,

        _score: 0,
        _combo: -1,
        _comboval: 0,
        _bombmeter: 0,
        _bombtimer: 0,
        _bombtime: 100,
        _bombing: false,

        _destroyEnemy: function(entityHit) {
            var slashimg = Crafty.e('2D, Canvas, slash, SpriteAnimation, Expires')
                .attr({x: entityHit.x + 10, y: entityHit.y+10, w:20, h:20, z: -999})
                .reel('slash', 50, 0, 0, 5)
                .animate('slash')
                .expires(100)
                .origin(10, 10);
            var bloodsprite = Crafty.e('2D, Canvas, bloodspray, SpriteAnimation')
                .attr({x: entityHit.x + 10, y: entityHit.y + 10, w:20, h:20, z: -1000})
                .reel('spray', 100, 0, 0, 5)
                .animate('spray')
                .origin(10, 10);

            slashimg.rotation = this.rotation + 90;
            bloodsprite.rotation = this.rotation + 90;

            if(this._combo >= 0) {
                if(this._bombing) {
                    this._comboval += 5;
                } else if(entityHit.isSpecialEnemy()) {
                    this._comboval += special_combo_val;
                } else {
                    this._comboval += normal_combo_val;
                }
                this._score += this._comboval;

                var textsize = 8 + this._comboval / 5.0;
                var redness = Math.min(0 + this._comboval, 255);
                var rednessHex = redness.toString(16);
                if(rednessHex.length < 2) {
                    rednessHex = '0' + rednessHex;
                }

                Crafty.e('2D, Canvas, Text, Expires')
                    .attr({x: entityHit.x, y: entityHit.y, w:20, h:20})
                    .textFont({size:textsize + 'px'})
                    .textColor('#' + rednessHex + '0000')
                    .text('+' + this._comboval)
                    .expires(1000 + this._comboval * 5);
                this._combo++;
            }

            entityHit.destroy();
            this.trigger('EnemyKill');
            this.trigger('ScoreChange', this._score);
        },

        _bombframe: function(data) {
            this._bombtimer += data.dt;
            if(this._bombtimer >= this._bombtime) {
                var enemy = Crafty('Enemy').get(0);
                if(enemy === undefined) {
                    this._bombing = false;
                    //Don't count the bomb as a combo
                    this._combo = 0;
                    this.unbind('EnterFrame', this._bombframe);
                    this.trigger('EndBomb');
                } else {
                    this._destroyEnemy(enemy);
                    this.trigger('BombKill');
                }
                this._bombtimer -= this._bombtime;
            }
        },

        _startbomb: function() {
            this._bombmeter = 0;
            this._bombing = true;
            this._combo = 0;
            this.trigger('NewMeter', this._bombmeter / bombmeter_max * 100);
            this.bind('EnterFrame', this._bombframe);
        },

        _canBomb: function() {
            return this._bombmeter >= bombmeter_max;
        },

        _onHit: function(hitData) {
            for(var i = 0; i < hitData.length; i++) {
                var entityHit = hitData[i].obj;
                if(this._destroy) {
                    this._destroyEnemy(entityHit);
                }
            }
        },

        _onMaxMove: function() {
        },

        _onStartDash: function() {
            this._destroy= true;
            this._combo = 0;
        },

        _onEndDash: function() {
            this._bombmeter = Math.min(Math.max(0, this._bombmeter + this._combo - 1), bombmeter_max);
            this.trigger('NewCombo', this._combo);
            this.trigger('NewMeter', this._bombmeter / bombmeter_max * 100);
            this._comboval = 0;
            this._destroy= false;
            this._combo = -1;
        },

        init: function() {
            this.onHit('Enemy', this._onHit);
            //this.bind("HitOn", this._onHit);
            this.bind('HitMaxSpeed', this._onMaxMove);
            this.bind('StartDash', this._onStartDash);
            this.bind('StopDash', this._onEndDash);
            this.bind('StartBomb', this._startbomb);
        },

        enemydestroyer: function() {
            return this;
        },
    });
});
