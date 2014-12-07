
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;
    var pi = 3.14159;

    Crafty.c("EnemySpawner", {
        _mintime: 500,
        _maxtime: 1000,
        _lightchance: 0.80,
        _heavychance: 0.10,
        _throwerchance: 0.10,

        _time: 1000,
        _timer : 0,
        _nextspawn: 0,
        _sinceheavy: 0,
        _sincethrower: 0,

        _difficultytime: 1000,
        _difficultytimer: 0,
        _reduction: 10,

        _spawn: function() {
            var randspawn = Math.random();
            var side = Math.floor(Math.random() * 4);
            var pos = new Vec2d(0, 0);
            if(side == 0 || side == 2) {
                pos.x = Math.random() * this.w;
            } else if(side == 1) {
                pos.x = this.w;
            }
            if(side == 1 || side == 3) {
                pos.y = Math.random() * this.h;
            } else if(side == 2) {
                pos.y = this.h;
            }

            if(randspawn < this._lightchance && this._sinceheavy < 9 && this._sincethrower < 9) {
                var enemy = Crafty.e('2D, Canvas, Color, SimpleEnemy, Enemy, KillPlayer')
                    .attr({x: pos.x, y: pos.y, w: 10, h: 10, z: 1})
                    .color('green')
                    .simpleenemy('Player', 4)
                    .setLight();
                this._sinceheavy++;
                this._sincethrower++;
            } else if (this._sincethrower >= 9 ||
                    randspawn >= this._lightchance && randspawn < this._lightchance + this._throwerchance) {
                var enemy = Crafty.e('2D, Canvas, Color, ThrowerEnemy, Enemy, KillPlayer')
                    .attr({x: pos.x, y: pos.y, w: 10, h: 10, z: 1})
                    .color('blue')
                    .throwerenemy('Player', 15)
                    .setLight();
                this._sincethrower = 0;
            } else {
                var enemy = Crafty.e('2D, Canvas, Color, HeavyEnemy, Enemy, KillPlayer')
                    .attr({x: pos.x, y: pos.y, w: 15, h: 15, z: 1})
                    .color('#0000FF')
                    .heavyenemy('Player', 1, 8.5, 0.01)
                    .setHeavy();
                this._sinceheavy = 0;
            }
        },

        _newnextspawn: function() {
            this._nextspawn = this._time;
        },

        _enterframe: function(data) {
            this._timer += data.dt;
            this._difficultytimer += data.dt;
            if(this._timer > this._nextspawn) {
                this._spawn();
                this._timer -= this._nextspawn;
                this._newnextspawn();
            }

            if(this._time > this._mintime &&
                    this._difficultytimer  > this._difficultytime) {
                this._time -= this._reduction;
                this._difficultytimer -= this._difficultytime;
            }
        },

        init: function() {
            this.bind("EnterFrame", this._enterframe);
            this._newnextspawn();
        },

        enemyspawner: function(low, high, lightchance) {
            this._mintime = low;
            this._maxtime = high;
            this._lightchance = lightchance;

            this._time = this._maxtime;
            return this;
        }
    });
});
