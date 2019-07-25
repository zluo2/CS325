var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Preload = (function (_super) {
        __extends(Preload, _super);
        function Preload() {
            _super.call(this);
            this.preloadBarTopPadding = 128;
            this.ready = false;
        }
        Preload.prototype.preload = function () {
            this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.splash.anchor.setTo(0.5);
            this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + this.preloadBarTopPadding, 'preloadbar');
            this.preloadBar.anchor.setTo(0.5);
            this.load.setPreloadSprite(this.preloadBar);
            this.load.image('ground', 'assets/images/ground.png');
            this.load.image('background', 'assets/images/background.png');
            this.load.image('foreground', 'assets/images/foreground.png');
            this.load.image('shadow', 'assets/images/shadow.png');
            this.load.spritesheet('coins', 'assets/images/coins-ps.png', 51, 51, 7);
            this.load.spritesheet('player', 'assets/images/jetpack-ps.png', 229, 296, 4);
            this.load.spritesheet('missile', 'assets/images/missiles-ps.png', 361, 218, 4);
            this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3', 'assets/audio/Pamgaea.ogg']);
            this.load.audio('rocket', 'assets/audio/rocket.wav');
            this.load.audio('bounce', 'assets/audio/bounce.wav');
            this.load.audio('coin', 'assets/audio/coin.wav');
            this.load.audio('death', 'assets/audio/death.wav');
            this.load.bitmapFont('minecraftia', 'assets/fonts/minecraftia/minecraftia.png', 'assets/fonts/minecraftia/minecraftia.xml');
            this.load.onLoadComplete.add(this.onLoadComplete, this);
        };
        Preload.prototype.update = function () {
            if (this.cache.isSoundDecoded('gameMusic') && this.ready) {
                this.game.state.start('MainMenu');
            }
        };
        Preload.prototype.onLoadComplete = function () {
            this.ready = true;
        };
        return Preload;
    })(Phaser.State);
    Runner.Preload = Preload;
})(Runner || (Runner = {}));
