var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var MainMenu = (function (_super) {
        __extends(MainMenu, _super);
        function MainMenu() {
            _super.call(this);
        }
        MainMenu.prototype.create = function () {
            this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
            this.background.autoScroll(MainMenu.BackgroundVelocity, 0);
            this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
            this.foreground.autoScroll(MainMenu.BackgroundVelocity, 0);
            this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
            this.ground.autoScroll(MainMenu.FloorVelocity, 0);
            this.player = new Runner.Player(this.game, 200, this.game.height / 2);
            this.game.add.existing(this.player);
            this.game.add.tween(this.player).to({ y: this.player.y - 16 }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);
            this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
            this.splash.anchor.setTo(0.5);
            this.startText = this.game.add.bitmapText(0, 0, 'minecraftia', 'tap to start', 32);
            this.startText.x = this.game.width / 2 - this.startText.textWidth / 2;
            this.startText.y = this.game.height / 2 + this.splash.height / 2;
        };
        MainMenu.prototype.update = function () {
            this.player.updateShadow();
            if (this.game.input.activePointer.justPressed()) {
                this.game.state.start('Game');
            }
        };
        MainMenu.BackgroundVelocity = -100;
        MainMenu.FloorVelocity = -400;
        return MainMenu;
    })(Phaser.State);
    Runner.MainMenu = MainMenu;
})(Runner || (Runner = {}));
