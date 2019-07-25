var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Scoreboard = (function (_super) {
        __extends(Scoreboard, _super);
        function Scoreboard(game) {
            _super.call(this, game);
        }
        Scoreboard.prototype.show = function (score) {
            var bmd;
            var background;
            var gameoverText;
            var scoreText;
            var highScoreText;
            var newHighScoreText;
            var startText;
            bmd = this.game.add.bitmapData(this.game.width, this.game.height);
            bmd.ctx.fillStyle = '#000';
            bmd.ctx.fillRect(0, 0, this.game.width, this.game.height);
            background = this.game.add.sprite(0, 0, bmd);
            background.alpha = 0.5;
            this.add(background);
            var isNewHighScore = false;
            var highscore = localStorage.getItem('highscore');
            if (!highscore || highscore < score) {
                isNewHighScore = true;
                highscore = score;
                localStorage.setItem('highscore', highscore);
            }
            this.y = this.game.height;
            gameoverText = this.game.add.bitmapText(0, 100, 'minecraftia', 'You Died.', 36);
            gameoverText.x = this.game.width / 2 - (gameoverText.textWidth / 2);
            this.add(gameoverText);
            scoreText = this.game.add.bitmapText(0, 200, 'minecraftia', 'Your Score: ' + score, 24);
            scoreText.x = this.game.width / 2 - (scoreText.textWidth / 2);
            this.add(scoreText);
            highScoreText = this.game.add.bitmapText(0, 250, 'minecraftia', 'Your High Score: ' + highscore, 24);
            highScoreText.x = this.game.width / 2 - (highScoreText.textWidth / 2);
            this.add(highScoreText);
            startText = this.game.add.bitmapText(0, 300, 'minecraftia', 'Tap to play again!', 16);
            startText.x = this.game.width / 2 - (startText.textWidth / 2);
            this.add(startText);
            if (isNewHighScore) {
                newHighScoreText = this.game.add.bitmapText(0, 100, 'minecraftia', 'New High Score!', 12);
                newHighScoreText.tint = 0x4ebef7;
                newHighScoreText.x = gameoverText.x + gameoverText.textWidth + 40;
                newHighScoreText.angle = 45;
                this.game.add.tween(newHighScoreText.scale).to({ x: 2, y: 2 }, 500, Phaser.Easing.Back.Out, true, 0, Infinity, true);
                this.add(newHighScoreText);
            }
            this.game.add.tween(this).to({ y: 0 }, this.game.height, Phaser.Easing.Bounce.Out, true);
            this.game.input.onDown.addOnce(this.restart, this);
        };
        Scoreboard.prototype.restart = function () {
            this.game.state.start('Game', true, false);
        };
        return Scoreboard;
    })(Phaser.Group);
    Runner.Scoreboard = Scoreboard;
})(Runner || (Runner = {}));
