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