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




var Scoreboard = function(game) {
  Phaser.Group.call(this, game);
};

Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function(score) {
  var bmd, background, gameoverText, scoreText, highScoreText, newHighScoreText, starText;

  bmd = this.game.add.bitmapData(this.game.width, this.game.height);
  bmd.ctx.fillStyle = '#000';
  bmd.ctx.fillRect(0,0, this.game.width, this.game.height);

  background = this.game.add.sprite(0,0, bmd);
  background.alpha = 0.5;

  this.add(background);

  var isNewHighScore = false;
  var highscore = localStorage.getItem('highscore');
  if(!highscore || highscore < score) {
    isNewHighScore = true;
    highscore = score;
    localStorage.setItem('highscore', highscore);
  }

  this.y = 0 - this.game.height;// position that scoreboard starts from

  gameoverText = this.game.add.bitmapText(0,150, 'brokenstick', 'Crashed Again.', 50);
  gameoverText.x = this.game.width/2 - (gameoverText.textWidth / 2);
  this.add(gameoverText);

  scoreText = this.game.add.bitmapText(0, 250, 'brokenstick', 'Your Score: ' + score, 36);
  scoreText.x = this.game.width / 2 - (scoreText.textWidth / 2);  
  this.add(scoreText);

  //highScoreText = this.game.add.bitmapText(0, 300, 'brokenstick', 'Your High Score: ' + highscore, 36);
  //highScoreText.x = (this.game.width / 2 - (highScoreText.textWidth / 2)) - 5;  
  //this.add(highScoreText);


  startText = this.game.add.bitmapText(0, 350, 'brokenstick', 'Tap to ride again!', 30);
  startText.anchor.setTo(0.5);
  startText.x = (this.game.width / 2 - (startText.textWidth / 2))+130;  
  this.game.add.tween(startText.scale).to({x: 1.1, y: 1.1}, 400, Phaser.Easing.Linear.NONE, true, 2000, Infinity, true);//ease,autostart,delay,repeat,yoyo
  startText.tint = 0xeafffa;
  this.add(startText);

  if(isNewHighScore) {
    newHighScoreText = this.game.add.bitmapText(0, 100, 'brokenstick', 'New High Score!', 36);
    newHighScoreText.x = this.game.width / 2 - (newHighScoreText.textWidth / 2); 
    newHighScoreText.tint = 0x31ffd5; //green 
    this.game.add.tween(newHighScoreText).from({y: 0}, 2000, Phaser.Easing.Bounce.Out, true, 100, 0, false);//ease,autostart,delay,repeat,yoyo
    //newHighScoreText.y = 300;
    //this.game.add.tween(newHighScoreText).to({y: newHighScoreText.y - 5}, 500, Phaser.Easing.Linear.NONE, true, 3000, Infinity, true);


    this.add(newHighScoreText);
  }

  this.game.add.tween(this).to({y: -5}, 1000, Phaser.Easing.Bounce.Out, true);

  //if click event or spacebar press, restart
  this.game.input.onDown.addOnce(this.restart, this);
  this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(this.restart, this);

};

Scoreboard.prototype.restart = function() {
    if(this.game.input.activePointer.justPressed()){
        isMainMenuClicked = true;
        this.game.state.start('Game', true, false); 

    } else if (this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown) {
        isMainMenuClicked = false;
        this.game.state.start('Game', true, false); 
    }
  
  
};

var CrashedAgain = function() {};

CrashedAgain.Boot = function() {};

CrashedAgain.Boot.prototype = {
  preload: function() {
    //this.load.image('logo', 'assets/images/logo.png');
    this.load.image('preloader', 'assets/images/preloader.png');
  },
  create: function() {
    this.game.stage.backgroundColor = '#fff';
    this.input.maxPointers = 1;//no multitouch

    if (this.game.device.desktop) {
      this.scale.pageAlignHorizontally = true;
    } else {
       this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
       this.scale.minWidth = 568;
       this.scale.minHeight = 600;
       this.scale.maxWidth = 2048;
       this.scale.maxHeight = 1536;
       this.scale.forceLandscape = true;
       this.scale.pageAlignHorizontally = true;
       this.scale.updateLayout (true);
    }

    this.state.start('Preloader');
  }
};
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
CrashedAgain.MainMenu = function() {};

CrashedAgain.MainMenu.prototype = {
  create: function() {
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.background.autoScroll(0, 400);

    //player
    this.player = this.add.sprite(200, this.game.height - 100, 'player');
    this.player.anchor.setTo(0.5);
    this.player.scale.setTo(0.8);

    //player animations
    this.player.animations.add('ride', [0,1]); //loop through frames 0 and 1
    this.player.animations.play('ride', 30, true);
    this.game.add.tween(this.player).to({y: this.player.y - 5}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);
    this.game.add.tween(this.player).to({x: this.player.x - 5}, 500, Phaser.Easing.Linear.NONE, true, 0, Infinity, true);

    //logo
    //this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    // this.splash.anchor.setTo(0.5);
    this.titleText = this.game.add.bitmapText(0,0, 'whiskeybravo', 'Crashed', 60);
    this.titleText.x = (this.game.world.centerX / 2) - 30;
    this.titleText.y = (window.innerHeight / 2) / 2;
    this.titleText2 = this.game.add.bitmapText(0,0, 'whiskeybravo', 'Again', 60);
    this.titleText2.x = (this.game.world.centerX / 2) + 9;
    this.titleText2.y = this.titleText.y + 50;

    //start text
    this.startText = this.game.add.bitmapText(0,0, 'whiskeybravo', 'tap to start', 32);
    this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
    this.startText.y = this.game.height / 2 + this.titleText.height / 2;

  },
  update: function() {       
    if(this.game.input.activePointer.justPressed()){
        isMainMenuClicked = true;
        this.game.state.start('Game');

    } else if (this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown) {
        isMainMenuClicked = false;
        this.game.state.start('Game');
    }

  }
};
CrashedAgain.Preload = function() {
  this.ready = false;
};

CrashedAgain.Preload.prototype = {
  preload: function() {

   // this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
    //this.splash.anchor.setTo(0.5);

    this.preloadImg = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloader');
    this.preloadImg.anchor.setTo(0.5);

    this.load.setPreloadSprite(this.preloadImg);

    this.load.image('background', 'assets/images/background.png');
    this.load.image('bolts', 'assets/images/bolt.png');
    this.load.spritesheet('enemies', 'assets/images/cars.png', 103, 228, 7);
    this.load.spritesheet('player', 'assets/images/bikes.png', 58, 126, 8);//8 bike frames
    this.load.spritesheet('crashes', 'assets/images/crashes.png', 121, 126, 2);

    this.load.audio('gameMusic', ['assets/audio/bg.mp3', 'assets/audio/bg.ogg']);
    this.load.audio('bolt', 'assets/audio/bolt.wav');
    this.load.audio('crash', 'assets/audio/crash.wav');

    this.load.bitmapFont('whiskeybravo', 'assets/fonts/whiskeybravo/whiskeybravo.png', 'assets/fonts/whiskeybravo/whiskeybravo.xml');
    this.load.bitmapFont('brokenstick', 'assets/fonts/brokenstick/brokenstick.png', 'assets/fonts/brokenstick/brokenstick.xml');

    this.load.onLoadComplete.add(this.onLoadComplete, this);
  },
  create: function() {
    this.preloadImg.cropEnabled = false;
  }, 
  update: function() {
    if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
      this.state.start('MainMenu');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};
var game = new Phaser.Game(400, window.innerHeight, Phaser.CANVAS, '', null);
var isMainMenuClicked = false;

game.state.add('Boot', CrashedAgain.Boot);
game.state.add('Preloader', CrashedAgain.Preload);
game.state.add('MainMenu', CrashedAgain.MainMenu);
game.state.add('Game', CrashedAgain.Game);

game.state.start('Boot');