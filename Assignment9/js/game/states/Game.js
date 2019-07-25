CrashedAgain.Game = function() {
  this.playerMinAngle = -20;
  this.playerMaxAngle = 20;
  
  this.boltRate = 1000;//generate bolt every 1000ms
  this.boltTimer = 0;

  this.enemyRate = 1100;
  this.enemyTimer = 0;

  this.score = 0;
};

CrashedAgain.Game.prototype = {
  create: function() {

    this.game.world.bound = new Phaser.Rectangle(0,0, this.game.width, this.game.height);

    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(0, 900);

    //player
    this.player = this.add.sprite(200, this.game.height - 100, 'player');
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.8);
    this.player.animations.add('wheelie', [6,7]);
    this.player.animations.add('ride', [0,1]); //loop through frames 0 and 1
    this.player.animations.play('ride', 30, true);


    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 400;//set gravity to 400
    this.game.physics.arcade.enableBody(this.player);
    this.player.body.collideWorldBounds = true;//player is bound to the world
    this.player.body.setSize(58,126);//collision box size of player

    this.bolts = this.game.add.group();//group for bolts
    this.enemies = this.game.add.group();//group for enemies

    this.scoreText = this.game.add.bitmapText(15,10, 'brokenstick', 'Score: 0', 36);//x,y,font,text,size
    this.scoreText.tint = 0x31ffd5;

    this.boltSound = this.game.add.audio('bolt');
    this.crashSound = this.game.add.audio('crash');
    this.gameMusic = this.game.add.audio('gameMusic');
    this.gameMusic.play('', 0, true, 0.1);//marker, startposition, loop, volume

    cursors = game.input.keyboard.createCursorKeys(); //controls
  },
  update: function() {

    this.bolts.forEach(function(item) { item.rotation += 0.75; }, this); //make each bolt spin
   // this.enemies.forEach(function(car){ //gradually increase speed
   //   car.body.velocity.y = car.body.velocity.y + this.score;
   // }, this);

     if (!isMainMenuClicked) {
      if(cursors.left.isDown) {
        this.player.body.velocity.x -= 55;
        this.player.frame = 2;
      }
      else if(cursors.right.isDown){
        this.player.body.velocity.x += 55;
        this.player.frame = 3;
      }
      if(cursors.up.isDown) {
        //this.player.frame = 6;
        this.player.animations.play('wheelie', 30, true);
        this.player.body.velocity.y -= 10;
      } else {
        this.player.animations.play('ride', 30, true);
      }
     } else {
        if (this.game.input.activePointer.isDown) {
            game.physics.arcade.moveToPointer(this.player, 350);//sprite,speed
            if (this.player.deltaY < 0){
              this.player.animations.play('wheelie', 30, true);
            } else if (this.player.deltaX < 0){
              this.player.frame = 2;
            } else if(this.player.deltaX > 0){
              this.player.frame = 3;
            }
            //  if it's overlapping the mouse, don't move any more
            if (Phaser.Rectangle.contains(this.player.body, this.game.input.x, this.game.input.y)) {
              this.player.frame = 0;
              this.player.body.velocity.y += 30;
            }
        } else {
            this.player.animations.play('ride', 30, true);
            this.player.body.velocity.y += 30;
          }
      } 

    if(this.boltTimer < this.game.time.now) {//if timer runs out 
      this.createBolt();//create bolt
      this.boltTimer = this.game.time.now + this.boltRate;//set the timer again
    }

    if(this.enemyTimer < this.game.time.now) {
      this.createEnemy();
      this.enemyTimer = this.game.time.now + this.enemyRate;
    }

    //check for collision b/w player and ground, apply physics. two objects, callback, custom collision (null), context of callback
    //this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.bolts, this.boltHit, null, this);//overlap with bolt
    this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);//overlap with enemy

  },
  shutdown: function() {
    this.bolts.destroy();
    this.enemies.destroy();
    this.score = 0;
    this.boltTimer = 0;
    this.enemyTimer = 0;
  },
  createBolt: function() {
    var x = this.game.rnd.integerInRange(50, this.game.world.width - 50);//random int from 50 to within world
    var y = 0;

    var bolt = this.bolts.getFirstExists(false);//get first bolt in the group that has its exists property set to false (recycles it)
    if(!bolt) {//if there were no bolts (eg. start)
      bolt = new Bolt(this.game, 0, 0);
      this.bolts.add(bolt);//add bolt to group
    }

    bolt.reset(x, y);//set the x,y position
    bolt.revive();//calls the onRevived function in Bolt.js
  },
  createEnemy: function() {
    var x = this.game.rnd.integerInRange(50, this.game.world.width - 50);
    var y = -20;

    var enemy = this.enemies.getFirstExists(false);
    
    if(!enemy) {
      enemy = new Enemy(this.game, 0, y);
      this.enemies.add(enemy);
    }
    enemy.reset(x, y);
    enemy.revive();
  },
  boltHit: function(player, bolt) {
    if (cursors.up.isDown){
      this.score += 2;
    } else {
      this.score++;
    }
    this.boltSound.play();
    bolt.kill();

    var dummyBolt = new Bolt(this.game, bolt.x, bolt.y);
    this.game.add.existing(dummyBolt);

    //dummyBolt.animations.play('spin', 40, true);

    var scoreTween = this.game.add.tween(dummyBolt).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.NONE, true);

    scoreTween.onComplete.add(function() {
      dummyBolt.destroy();
      this.scoreText.text = 'Score: ' + this.score;
    }, this);

  },
  enemyHit: function(player, enemy) {
    this.crash = this.add.sprite(this.player.x - 30, this.player.y - 100, 'player');//add crash sprite
    this.crash.animations.add('crash', [4,5]); //frames 4 and 5
    this.crash.animations.play('crash', 10, false);
    this.game.time.events.add(2000, function() {//player fades out after hit
      this.game.add.tween(this.crash).to({y: this.game.height+200}, 1500, Phaser.Easing.Linear.None, true);
      this.game.add.tween(this.crash).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true);
    }, this);

    player.kill();
    enemy.kill();

    this.crashSound.play();
    this.gameMusic.stop();
    
    this.background.stopScroll();

    this.enemies.setAll('body.velocity.x', 0);//sets all enemies to stop
    this.bolts.setAll('body.velocity.x', 0);//sets all bolts to stop

    this.enemyTimer = Number.MAX_VALUE;//stop generating
    this.boltTimer = Number.MAX_VALUE;

    var scoreboard = new Scoreboard(this.game);
    scoreboard.show(this.score);
  }
};