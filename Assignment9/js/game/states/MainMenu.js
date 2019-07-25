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