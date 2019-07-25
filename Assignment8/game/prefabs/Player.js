var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Player = (function (_super) {
        __extends(Player, _super);
        function Player(game, x, y, key, frame) {
            _super.call(this, game, x, y, "player", frame);
            this.anchor.setTo(0.5);
            this.scale.setTo(0.25);
            this.animations.add('fly', [0, 1, 2, 3, 2, 1]);
            this.animations.play('fly', 8, true);
            this.game.physics.arcade.enableBody(this);
            this.body.collideWorldBounds = true;
            this.shadow = this.game.add.sprite(this.x, this.game.world.height - 73, 'shadow');
            this.shadow.anchor.setTo(0.5, 0.5);
            this.jetSound = this.game.add.audio('rocket');
        }
        Player.prototype.fly = function () {
            this.body.velocity.y -= Player.JumpHeigth;
            if (!this.jetSound.isPlaying) {
                this.jetSound.play('', 0, 0.5, false, true);
            }
            this.animations.play('fly', 16);
        };
        Player.prototype.stopFly = function () {
            this.jetSound.stop();
        };
        Player.prototype.updateAngle = function () {
            if (this.body.velocity.y < 0 || this.game.input.activePointer.isDown) {
                if (this.angle > 0) {
                    this.angle = 0;
                }
                if (this.angle > Player.PlayerMinAngle) {
                    this.angle -= 0.5;
                }
            }
            if (this.body.velocity.y >= 0 && !this.game.input.activePointer.isDown) {
                if (this.angle < Player.PlayerMaxAngle) {
                    this.angle += 0.5;
                }
            }
        };
        Player.prototype.updateShadow = function () {
            this.shadow.scale.setTo(this.y / this.game.height);
        };
        Player.JumpHeigth = 25;
        Player.PlayerMinAngle = -15;
        Player.PlayerMaxAngle = 15;
        return Player;
    })(Phaser.Sprite);
    Runner.Player = Player;
})(Runner || (Runner = {}));
