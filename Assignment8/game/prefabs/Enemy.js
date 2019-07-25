var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Enemy = (function (_super) {
        __extends(Enemy, _super);
        function Enemy(game, x, y, key, frame) {
            _super.call(this, game, x, y, "missile", frame);
            this.scale.setTo(0.1);
            this.anchor.setTo(0.5);
            this.animations.add('fly');
            this.game.physics.arcade.enableBody(this);
            this.body.allowGravity = false;
            this.checkWorldBounds = true;
            this.outOfBoundsKill = true;
            this.events.onRevived.add(this.onRevived, this);
        }
        Enemy.prototype.onRevived = function () {
            this.game.add.tween(this).to({ y: this.y - 16 }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);
            this.body.velocity.x = Enemy.Velocity;
            this.animations.play('fly', 10, true);
        };
        Enemy.Velocity = -600;
        return Enemy;
    })(Phaser.Sprite);
    Runner.Enemy = Enemy;
})(Runner || (Runner = {}));
