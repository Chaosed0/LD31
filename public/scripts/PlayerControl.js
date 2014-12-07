
define(function(require) {
    var Crafty = require('crafty');
    var Vec2d = Crafty.math.Vector2D;
    var pi = 3.14159;

    var dashdecel = 3.0;
    var maxdashspeed = 40.0;
    var mindashspeed = 30.0;
    var enddashspeed = 1.0;

    var turnTowards = function(from, to) {
        var c1 = to - from;
        var c2 = to + 2*pi - from;
        var c3 = to - 2*pi - from;
        var shortest;
        if(Math.abs(c1) <= Math.abs(c2)) {
            if(Math.abs(c1) <= Math.abs(c3)) {
                shortest = c1;
            } else {
                shortest = c3;
            }
        } else {
            if(Math.abs(c2) <= Math.abs(c3)) {
                shortest = c2;
            } else {
                shortest = c3;
            }
        }
        return shortest?shortest<0?-1:1:0;
    };

    var constrainAngle = function(angle) {
        if(angle < -pi) {
            angle += 2 * pi;
        } else if(angle > pi) {
            angle -= 2 * pi;
        }
        return angle;
    };
    
    Crafty.c("PlayerControl", {
        _moving: true,
        _speed: 0,
        _maxspeed: 8,
        _acceleration: 0.3,
        _turnrate: 0.4,
        _hitmaxspeed: false,

        _dashing: false,
        _target: new Vec2d(0,0),
        _targetangle: 0,
        _moveangle: 0,

        _mousedown: function(e) {
            if(e.mouseButton == 0) {
                //LMB
                var position = new Vec2d(this.x, this.y);
                var target = new Vec2d(e.realX, e.realY);
                var rel = target.subtract(position);
                this._targetangle = Math.atan2(rel.y, rel.x);

                if(!this._dashing && this._speed >= 0) {
                    this._dashing = true;
                    //Dash to mouse pointer; I derived this equation for speed
                    this._speed = Math.sqrt(2 * dashdecel * rel.magnitude());
                    this._speed = Math.min(this._speed, maxdashspeed);
                    this._speed = Math.max(this._speed, mindashspeed);
                    this._moveangle = this._targetangle;
                    this.trigger('StartDash');
                }
            } else if(e.mouseButton == 2 && this._canBomb()) {
                //RMB, bomb - pass control to entityDestroyer
               this._speed = 0;
               this._moving = false;
               this._dashing = false;
               this.visible = false;
               this.trigger('StopDash');
               this.trigger('StartBomb');
               this.bind('EndBomb', function() {
                   this.visible = true;
                   this._moving = true;
               });
            }
        },

        _mousemove: function(e) {
            this._target = new Vec2d(e.realX, e.realY);
        },

        _enterframe: function() {
            if(this._moving) {
                if(!this._dashing) {
                    if(this._speed < this._maxspeed) {
                        this._speed += this._acceleration;
                        this._hitmaxspeed = false;
                    } else {
                        this._speed = this._maxspeed;
                        if(!this._hitmaxspeed) {
                            this._hitmaxspeed = true;
                            this.trigger('HitMaxSpeed');
                        }
                    }
                } else {
                    if(this._speed > enddashspeed) {
                        this._speed -= dashdecel;
                    } else {
                        this._dashing = false;
                        this.trigger('StopDash');
                    }
                }
            }

            if(this._speed > 0) {
                var position = new Vec2d(this.x, this.y);
                var rel = this._target.clone().subtract(position);
                //Don't change direction while dashing
                if(!this._dashing) {
                    var targetangle = Math.atan2(rel.y, rel.x);
                    var turnDir = turnTowards(this._moveangle, targetangle);
                    this._moveangle += turnDir * Math.min(Math.abs(this._moveangle - targetangle),
                            this._turnrate);
                    this._moveangle = constrainAngle(this._moveangle);

                    this.rotation = this._moveangle * 360.0/(2*pi) + 90;
                }


                //If we're very close to the mouse, just don't move
                if(this._dashing || Math.abs(rel.x) > 4 || Math.abs(rel.y) > 4) {
                    var movement = new Vec2d(this._speed * Math.cos(this._moveangle),
                                    this._speed * Math.sin(this._moveangle));
                    this.x += movement.x;
                    this.y += movement.y;
                    this.trigger('Moved', {x: this.x - movement.x, y: this.y - movement.y});
                }
            }
        },

        init: function() {
            this.requires('Mouse');

            Crafty.addEvent(this, Crafty.stage.elem, "mousemove", this._mousemove);
            Crafty.addEvent(this, Crafty.stage.elem, "mouseup", this._mouseup);
            Crafty.addEvent(this, Crafty.stage.elem, "mousedown", this._mousedown);

            this.bind("EnterFrame", this._enterframe);
        },

        playercontrol: function(maxspeed, acceleration, turnrate) {
            this._maxspeed = maxspeed;
            this._acceleration = acceleration;
            this._turnrate = turnrate;
            return this;
        },

        maxspeed: function(maxspeed) {
            this._maxspeed = maxspeed;
        },

        acceleration: function(acceleration) {
            this._acceleration = acceleration;
        },

        turnrate: function(turnrate) {
            this._turnrate = turnrate;
        }
    })
});
