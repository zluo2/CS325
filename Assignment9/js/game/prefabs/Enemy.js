var Enemy = function(game, x, y, key, frame) {
  key = 'enemies';
  Phaser.Sprite.call(this, game, x, y, key, frame);

  this.scale.setTo(0.6);
  this.anchor.setTo(0.5,0.5);
  //this.scale.y *= -1; //flipped

  this.frame = this.game.rnd.between(0,6);

  this.game.physics.arcade.enableBody(this);
  this.body.allowGravity = false;
  this.body.setSize(55,126);//collision box size of player

  this.checkWorldBounds = true;
  this.onOutOfBoundsKill = true;
  

  this.events.onRevived.add(this.onRevived, this);

};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.onRevived = function() {
  var rnd = new Phaser.RandomDataGenerator();
  this.body.velocity.y = this.game.rnd.between(250,350);
  this.game.add.tween(this).to({x: this.x - 1}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
  
 // this.animations.play('fly', 10, true);
};



