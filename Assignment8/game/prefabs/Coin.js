var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Coin = (function (_super) {
        __extends(Coin, _super);
        function Coin(game, x, y, key, frame) {
            _super.call(this, game, x, y, "coins", frame);
            this.scale.setTo(0.5);
            this.anchor.setTo(0.5);
            this.animations.add('spin');
            this.game.physics.arcade.enableBody(this);
            this.body.allowGravity = false;
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
            this.events.onKilled.add(this.onKilled, this);
            this.events.onRevived.add(this.onRevived, this);
        }
        Coin.prototype.onRevived = function () {
            this.body.velocity.x = Coin.Velocity;
            this.animations.play('spin', 10, true);
        };
        Coin.prototype.onKilled = function () {
            this.animations.frame = 0;
        };
        Coin.Velocity = -400;
        return Coin;
    })(Phaser.Sprite);
    Runner.Coin = Coin;
})(Runner || (Runner = {}));
