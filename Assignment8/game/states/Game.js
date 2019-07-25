var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Runner;
(function (Runner) {
    var Game = (function (_super) {
        __extends(Game, _super);
        function Game() {
            _super.call(this);
            this.previousCoinType = null;
            this.spawnX = null;
            this.score = 0;
        }
        Game.prototype.create = function () {
            this.game.time.advancedTiming = true;
            this.game.world.bounds = new Phaser.Rectangle(0, 0, this.game.width + 300, this.game.height);
            this.background = this.game.add.tileSprite(0, 0, this.game.width, 512, 'background');
            this.background.autoScroll(-100, 0);
            this.foreground = this.game.add.tileSprite(0, 470, this.game.width, this.game.height - 533, 'foreground');
            this.foreground.autoScroll(-100, 0);
            this.ground = this.game.add.tileSprite(0, this.game.height - 73, this.game.width, 73, 'ground');
            this.ground.autoScroll(-400, 0);
            this.player = new Runner.Player(this.game, 200, this.game.height / 2);
            this.game.add.existing(this.player);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.physics.arcade.gravity.y = 500;
            this.game.physics.arcade.enableBody(this.ground);
            this.ground.body.allowGravity = false;
            this.ground.body.immovable = true;
            this.coins = this.game.add.group();
            this.enemies = this.game.add.group();
            this.scoreText = this.game.add.bitmapText(10, 10, 'minecraftia', 'Score: 0', 24);
            this.scoreboard = new Runner.Scoreboard(this.game);
            this.coinSound = this.game.add.audio('coin');
            this.deathSound = this.game.add.audio('death');
            this.bounceSound = this.game.add.audio('bounce');
            this.gameMusic = this.game.add.audio('gameMusic');
            this.gameMusic.play("", 0, 0.5, true);
            this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.createEnemy, this);
            this.enemyGenerator.timer.start();
            this.coinGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateCoins, this);
            this.coinGenerator.timer.start();
            this.spawnX = this.game.width + 64;
        };
        Game.prototype.update = function () {
            if (this.player.alive) {
                if (this.game.input.activePointer.isDown) {
                    this.player.fly();
                }
                else {
                    this.player.stopFly();
                }
                this.player.updateAngle();
                this.player.updateShadow();
                this.game.physics.arcade.collide(this.player, this.ground, this.groundHit, null, this);
                this.game.physics.arcade.overlap(this.player, this.coins, this.coinHit, null, this);
                this.game.physics.arcade.overlap(this.player, this.enemies, this.enemyHit, null, this);
            }
            else {
                this.game.physics.arcade.collide(this.player, this.ground);
            }
        };
        Game.prototype.groundHit = function (player, ground) {
            this.player.angle = 0;
            this.player.body.velocity.y = -100;
            this.bounceSound.play();
        };
        Game.prototype.coinHit = function (player, coin) {
            this.score++;
            this.coinSound.play();
            coin.kill();
            var dummyCoin = new Runner.Coin(this.game, coin.x, coin.y);
            this.game.add.existing(dummyCoin);
            dummyCoin.animations.play('spin', 40, true);
            var scoreTween = this.game.add.tween(dummyCoin).to({ x: 50, y: 50 }, 300, Phaser.Easing.Linear.None, true);
            scoreTween.onComplete.add(function () {
                dummyCoin.destroy();
                this.scoreText.text = 'Score: ' + this.score;
            }, this);
        };
        Game.prototype.createCoin = function (x, y) {
            x = x || this.spawnX;
            y = y || this.game.rnd.integerInRange(50, this.game.world.height - 192);
            var coin = this.coins.getFirstDead();
            if (!coin) {
                coin = new Runner.Coin(this.game, 0, 0);
                this.coins.add(coin);
            }
            coin.reset(x, y);
            coin.revive();
            return coin;
        };
        Game.prototype.createCoinGroup = function (columns, rows) {
            var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
            var coinRowCounter = 0;
            var coinColumnCounter = 0;
            var coin;
            for (var i = 0; i < columns * rows; i++) {
                coin = this.createCoin(this.spawnX, coinSpawnY);
                coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * Game.CoinSpacingX);
                coin.y = coinSpawnY + (coinRowCounter * coin.height) + (coinRowCounter * Game.CoinSpacingY);
                coinColumnCounter++;
                if (i + 1 >= columns && (i + 1) % columns === 0) {
                    coinRowCounter++;
                    coinColumnCounter = 0;
                }
            }
        };
        Game.prototype.generateCoins = function () {
            if (!this.previousCoinType || this.previousCoinType < 3) {
                var coinType = this.game.rnd.integer() % 5;
                switch (coinType) {
                    case 0:
                        break;
                    case 1:
                    case 2:
                        this.createCoin();
                        break;
                    case 3:
                        this.createCoinGroup(2, 2);
                        break;
                    case 4:
                        this.createCoinGroup(6, 2);
                        break;
                    default:
                        this.previousCoinType = 0;
                        break;
                }
                this.previousCoinType = coinType;
            }
            else {
                if (this.previousCoinType === 4) {
                    this.previousCoinType = 3;
                }
                else {
                    this.previousCoinType = 0;
                }
            }
        };
        Game.prototype.createEnemy = function () {
            var x = this.game.width;
            var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);
            var enemy = this.enemies.getFirstDead();
            if (!enemy) {
                console.log("create new enemy");
                enemy = new Runner.Enemy(this.game, 0, 0);
                this.enemies.add(enemy);
            }
            enemy.reset(x, y);
            enemy.revive();
        };
        Game.prototype.enemyHit = function (player, enemy) {
            this.player.alive = false;
            this.player.animations.stop();
            this.deathSound.play();
            this.gameMusic.stop();
            this.ground.stopScroll();
            this.background.stopScroll();
            this.foreground.stopScroll();
            this.enemies.setAll('body.velocity.x', 0);
            this.coins.setAll('body.velocity.x', 0);
            this.enemyGenerator.timer.stop();
            this.coinGenerator.timer.stop();
            var deathTween = this.game.add.tween(this.player).to({ angle: 180 }, 2000, Phaser.Easing.Bounce.Out, true);
            deathTween.onComplete.add(this.showScoreboard, this);
        };
        Game.prototype.showScoreboard = function () {
            this.scoreboard.show(this.score);
        };
        Game.prototype.shutdown = function () {
            console.log('shutting down');
            this.player.destroy();
            this.coins.destroy();
            this.enemies.destroy();
            this.score = 0;
            this.scoreboard.destroy();
            this.coinGenerator.timer.destroy();
            this.enemyGenerator.timer.destroy();
        };
        Game.prototype.render = function () {
            this.game.debug.text(this.game.time.fps.toString() || '--', 2, 14, "#00ff00");
        };
        Game.BackgroundVelocity = -100;
        Game.CoinSpacingX = 10;
        Game.CoinSpacingY = 10;
        return Game;
    })(Phaser.State);
    Runner.Game = Game;
})(Runner || (Runner = {}));
