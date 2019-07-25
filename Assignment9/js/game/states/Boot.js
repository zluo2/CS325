
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