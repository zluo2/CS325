var Bolt = function(game, x, y, key, frame) {
  key = 'bolts';
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.scale.setTo(0.5);
  this.anchor.setTo(0.5);

  //this.animations.add('spin');

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;

  this.checkWorldBounds = true;
  this.onOutOfBoundsKill = true;

  this.events.onKilled.add(this.onKilled, this);
  this.events.onRevived.add(this.onRevived, this);

  //this.game.add.tween(this).to({y: this.y - 5}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
  //this.game.add.tween(this).to({x: this.x - 5}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
};

Bolt.prototype = Object.create(Phaser.Sprite.prototype);
Bolt.prototype.constructor = Bolt;

Bolt.prototype.onRevived = function() {
  this.body.velocity.y = 400;
  //this.animations.play('spin', 10, true);
};

Bolt.prototype.onKilled = function() {
  //this.animations.frame = 0;
};

