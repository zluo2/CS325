var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Boot = (function (_super) {
        __extends(Boot, _super);
        function Boot() {
            _super.call(this);
        }
        Boot.prototype.preload = function () {
            this.load.image("logo", "assets/images/logo.png");
            this.load.image("preloadbar", "assets/images/preloader-bar.png");
        };
        Boot.prototype.create = function () {
            this.game.stage.backgroundColor = "#FFF";
            this.input.maxPointers = 1;
            if (this.game.device.desktop) {
                this.scale.pageAlignHorizontally = true;
            }
            else {
                this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
                this.scale.forceLandscape = true;
                this.scale.pageAlignHorizontally = true;
                this.scale.setScreenSize(true);
                this.game.scale.startFullScreen();
                this.game.scale.setShowAll();
                this.game.scale.refresh();
            }
            this.game.state.start('Preload');
        };
        return Boot;
    })(Phaser.State);
    Runner.Boot = Boot;
})(Runner || (Runner = {}));
