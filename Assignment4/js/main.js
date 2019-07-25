window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update });

    function preload() {

        game.load.atlas('breakout', 'assets/breakout.png', 'assets/breakout.json');
        game.load.image('starfield', 'assets/background.jpg');
        game.load.audio('music','assets/enter.mp3');
        game.load.audio('explosion','assets/explosion.mp3');
        game.load.audio('sword','assets/sword.mp3');
        game.load.image('dead1','assets/dead1.png');
        game.load.image('dead2','assets/dead2.png');
        game.load.image('dead3','assets/dead3.png');
        game.load.image('dead4','assets/dead4.png');
        game.load.image('hero','assets/hero.png');
        game.load.image('xxxx','assets/xxxx.png');
        game.load.spritesheet('snowflakes', 'assets/snowflakes.png', 17, 17);
        game.load.spritesheet('snowflakes_large', 'assets/snowflakes_large.png', 64, 64);

        
    }

  
    var ball;
    var paddle;
    var bricks;
    
    var music;
    var explosion;
    var sword;
    
    var ballOnPaddle = true;
    
    var lives = 3;
    var score = 0;
    
    var scoreText;
    var livesText;
    var introText;
    
    var s;

    var max = 0;
    var front_emitter;
    var mid_emitter;
    var back_emitter;
    var update_interval = 4 * 60;
    var i = 0;
    //var a = document.getElementById("a");

    
    function create() {
    
        game.physics.startSystem(Phaser.Physics.ARCADE);
    
        //  We check bounds collisions against all walls other than the bottom one
        game.physics.arcade.checkCollision.down = false;
    
        s = game.add.tileSprite(0, 0, 800, 600, 'starfield');
     
         back_emitter = game.add.emitter(game.world.centerX, -32, 600);
        back_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        back_emitter.maxParticleScale = 0.6;
        back_emitter.minParticleScale = 0.2;
        back_emitter.setYSpeed(20, 100);
        back_emitter.gravity = 0;
        back_emitter.width = game.world.width * 1.5;
        back_emitter.minRotation = 0;
        back_emitter.maxRotation = 40;
    
        mid_emitter = game.add.emitter(game.world.centerX, -32, 250);
        mid_emitter.makeParticles('snowflakes', [0, 1, 2, 3, 4, 5]);
        mid_emitter.maxParticleScale = 1.2;
        mid_emitter.minParticleScale = 0.8;
        mid_emitter.setYSpeed(50, 150);
        mid_emitter.gravity = 0;
        mid_emitter.width = game.world.width * 1.5;
        mid_emitter.minRotation = 0;
        mid_emitter.maxRotation = 40;
    
        front_emitter = game.add.emitter(game.world.centerX, -32, 50);
        front_emitter.makeParticles('snowflakes_large', [0, 1, 2, 3, 4, 5]);
        front_emitter.maxParticleScale = 1;
        front_emitter.minParticleScale = 0.5;
        front_emitter.setYSpeed(100, 200);
        front_emitter.gravity = 0;
        front_emitter.width = game.world.width * 1.5;
        front_emitter.minRotation = 0;
        front_emitter.maxRotation = 40;
    
        changeWindDirection();
    
        back_emitter.start(false, 14000, 20);
        mid_emitter.start(false, 12000, 40);
        front_emitter.start(false, 6000, 1000);
        
        
        music = game.add.audio('music');
        explosion = game.add.audio('explosion');
        sword = game.add.audio('sword');
        
        music.play();
    
        bricks = game.add.group();
        bricks.enableBody = true;
        bricks.physicsBodyType = Phaser.Physics.ARCADE;
    
        var brick;
    
        for (var y = 0; y < 4; y++)
        {
            for (var x = 0; x < 15; x++)
            {
                brick = bricks.create(120 + (40*x), 90 + (y * 60), 'dead' + (y+1));
                brick.body.bounce.set(1);
                brick.body.immovable = true;
            }
        }
    
        paddle = game.add.sprite(game.world.centerX, 500, 'hero');
        paddle.anchor.setTo(0.6, 0.6);
    
        game.physics.enable(paddle, Phaser.Physics.ARCADE);
    
        paddle.body.collideWorldBounds = true;
        paddle.body.bounce.set(1);
        paddle.body.immovable = true;
    
        ball = game.add.sprite(game.world.centerX, paddle.y - 16, 'xxxx');
        ball.anchor.set(0.4);
        ball.checkWorldBounds = true;
    
        game.physics.enable(ball, Phaser.Physics.ARCADE);
    
        ball.body.collideWorldBounds = true;
        ball.body.bounce.set(1);
    
       // ball.animations.add('spin', [ 'ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png' ], 50, true, false);
    
        ball.events.onOutOfBounds.add(ballLost, this);
    
        scoreText = game.add.text(0, 0, 'Score: 0', { font: "40px Arial", fill: "#ffffff", align: "left" });
        livesText = game.add.text(640, 0, 'Dart: 3', { font: "40px Arial", fill: "#ffffff", align: "left" });
        introText = game.add.text(game.world.centerX, 400, '- click to start -', { font: "55px Arial", fill: "#ffffff", align: "center" });
        introText.anchor.setTo(0.5, 0.5);
    
        game.input.onDown.add(releaseBall, this);
    
    }
    
    function update () {
    
        //  Fun, but a little sea-sick inducing :) Uncomment if you like!
        // s.tilePosition.x += (game.input.speed.x / 2);
    
        paddle.x = game.input.x;
        
        i++;

        if (i === update_interval)
        {
            changeWindDirection();
            update_interval = Math.floor(Math.random() * 20) * 60; // 0 - 20sec @ 60fps
            i = 0;
        }
    
        if (paddle.x < 24)
        {
            paddle.x = 24;
        }
        else if (paddle.x > game.width - 24)
        {
            paddle.x = game.width - 24;
        }
    
        if (ballOnPaddle)
        {
            ball.body.x = paddle.x;
        }
        else
        {
            game.physics.arcade.collide(ball, paddle, ballHitPaddle, null, this);
            game.physics.arcade.collide(ball, bricks, ballHitBrick, null, this);
        }
    
    }
    
    function releaseBall () {
    
        if (ballOnPaddle)
        {
            ballOnPaddle = false;
            ball.body.velocity.y = -300;
            ball.body.velocity.x = -75;
            ball.animations.play('spin');
            introText.visible = false;
        }
    
    }
    
    function ballLost () {
    
        lives--;
        livesText.text = 'Dart: ' + lives;
        explosion.play();
    
        if (lives === 0)
        {
            gameOver();
        }
        else
        {   
            ballOnPaddle = true;
    
            ball.reset(paddle.body.x + 16, paddle.y - 16);
            
            ball.animations.stop();
        }
    
    }
    
    function gameOver () {
    
        ball.body.velocity.setTo(0, 0);
        
        introText.text = 'Game Over!\n';
        introText.visible = true;
        
        music.stop();
        
        restart();
    
    }
    
    function ballHitBrick (_ball, _brick) {
    
        _brick.kill();
        sword.play();
    
        score += 100;
    
        scoreText.text = 'score: ' + score;
    
        //  Are they any bricks left?
        if (bricks.countLiving() == 0)
        {
            //  New level starts
            score += 1000;
            scoreText.text = 'score: ' + score;
            introText.text = '- Next Level -';
    
            //  Let's move the ball back to the paddle
            ballOnPaddle = true;
            ball.body.velocity.set(0);
            ball.x = paddle.x + 16;
            ball.y = paddle.y - 16;
            ball.animations.stop();
    
            //  And bring the bricks back from the dead :)
            bricks.callAll('revive');
        }
    
    }
    
    function ballHitPaddle (_ball, _paddle) {
    
        var diff = 0;
        var num = score/500+12;
    
        if (_ball.x < _paddle.x)
        {
            //  Ball is on the left-hand side of the paddle
            diff = _paddle.x - _ball.x;
            _ball.body.velocity.x = (-num * diff);
        }
        else if (_ball.x > _paddle.x)
        {
            //  Ball is on the right-hand side of the paddle
            diff = _ball.x -_paddle.x;
            _ball.body.velocity.x = (num * diff);
        }
        else
        {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            _ball.body.velocity.x = 2 + Math.random() * num;
        }
    
    }
    
    function changeWindDirection() {

    var multi = Math.floor((max + 200) / 4),
        frag = (Math.floor(Math.random() * 100) - multi);
    max = max + frag;

    if (max > 200) max = 150;
    if (max < -200) max = -150;

    setXSpeed(back_emitter, max);
    setXSpeed(mid_emitter, max);
    setXSpeed(front_emitter, max);

    }

    function setXSpeed(emitter, max) {
    
        emitter.setXSpeed(max - 20, max);
        emitter.forEachAlive(setParticleXSpeed, this, max);
    
    }
    
    function setParticleXSpeed(particle, max) {
    
        particle.body.velocity.x = max - Math.floor(Math.random() * 30);
    
    }
    
    function restart(){
        
        window.location.reload();
    }
    
    

};
