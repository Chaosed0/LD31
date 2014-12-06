
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;
    var pi = 3.14159;

    Crafty.c("EnemySpawner", {
        _mintime: 50,
        _maxtime: 1000,
        _radius: 500,
        _lightchance: 0.90,

        _time: 0,
        _timer : 0,
        _nextspawn: 0,

        _difficultytime: 1000,
        _difficultytimer: 0,
        _reduction: 1,

        _spawn: function() {
            var rand = Math.random();
            var angle = Math.random() * 2*pi;
            var spawnerpos = new Vec2d(this.x, this.y);
            var pos = spawnerpos.add(
                    new Vec2d(this._radius * Math.cos(angle), this._radius * Math.sin(angle)));

            if(rand < this._lightchance) {
                var enemy = Crafty.e('2D, Canvas, Color, FollowPlayer, Enemy')
                    .attr({x: pos.x, y: pos.y, w: 10, h: 10})
                    .color('green')
                    .followplayer('Player', 4)
                    .setLight();
            } else {
                var enemy = Crafty.e('2D, Canvas, Color, FollowPlayerVary, Enemy')
                    .attr({x: pos.x, y: pos.y, w: 15, h: 15})
                    .color('#0000FF')
                    .followplayer('Player', 1, 8, 0.01)
                    .setHeavy();
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
                this.difficultytimer -= this._difficultytime;
            }
        },

        init: function() {
            this.bind("EnterFrame", this._enterframe);
            this._newnextspawn();
        },

        enemyspawner: function(low, high, radius, lightchance) {
            this._mintime = low;
            this._maxtime = high;
            this._radius = radius;
            this._lightchance = lightchance;

            this._time = this._maxtime;
            return this;
        }
    });
});
