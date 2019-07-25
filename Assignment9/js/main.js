var game = new Phaser.Game(400, window.innerHeight, Phaser.CANVAS, '', null);
var isMainMenuClicked = false;

game.state.add('Boot', CrashedAgain.Boot);
game.state.add('Preloader', CrashedAgain.Preload);
game.state.add('MainMenu', CrashedAgain.MainMenu);
game.state.add('Game', CrashedAgain.Game);

game.state.start('Boot');