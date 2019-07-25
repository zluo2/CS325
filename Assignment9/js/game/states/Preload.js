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