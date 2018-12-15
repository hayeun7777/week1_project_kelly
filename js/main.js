var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, 'game', { 
	preload: preload, 
	create: create, 
	update: update,
    // render: render 
});

function preload() {
	//load necessary images
    game.load.image('bg', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/background.png');
    game.load.image('barrel', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/barrel.png');
    game.load.image('bacBottom', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/background_bottom.png');
    game.load.image('blueBarrel', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/blue_barrel.png');
    game.load.image('boxes', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/boxes3.png');
    game.load.image('button', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/play_button.png');
    game.load.image('lady', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/princess.png');
   	game.load.image('ladder', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/ladder.png');
    game.load.image('ladder2', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/ladder_piece.png');
    game.load.image('boxhit', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/single_box.png');
    game.load.image('replay', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/replay.png');
    game.load.image('winMsg', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/winMsg.png');
    //animation characters
    game.load.spritesheet('donkk', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/donkeykong.png', 176, 218, 4);
    game.load.spritesheet('explode', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/explode.png', 300, 260);
    game.load.spritesheet('heart', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/heart.png', 157, 140);
    game.load.spritesheet('player', 'https://hayeun7777.github.io/week1_project_kelly/assets/img/mario2.png', 29, 34);

    //load sounds and audio
    game.load.audio('boom','https://hayeun7777.github.io/week1_project_kelly/assets/audio/explosion.wav');
    game.load.audio('bacmusic','https://hayeun7777.github.io/week1_project_kelly/assets/audio/bacmusic.wav');
    game.load.audio('intro','https://hayeun7777.github.io/week1_project_kelly/assets/audio/intro1.wav');
    game.load.audio('walking','https://hayeun7777.github.io/week1_project_kelly/assets/audio/walking.wav');
    game.load.audio('jump','https://hayeun7777.github.io/week1_project_kelly/assets/audio/jump.wav');
    game.load.audio('jumpbar','https://hayeun7777.github.io/week1_project_kelly/assets/audio/jumpbar.wav');
    game.load.audio('death','https://hayeun7777.github.io/week1_project_kelly/assets/audio/death.wav');
    game.load.audio('win','https://hayeun7777.github.io/week1_project_kelly/assets/audio/win1.wav');

}
function create() {

	//Enabling Arcade Physics system
	game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.physics.arcade.checkCollision.down = false;
	var background = game.add.tileSprite(0, 0, game.width, game.height, 'bg'); 
	//add audios
	bacmusic = new Phaser.Sound(game,'bacmusic',1,true);
    intromusic = game.add.audio('intro', 1);
    dead = game.add.audio('death', 1);
    jumping = game.add.audio('jump', 1);
    walking = game.add.audio('walking', 1);
    winSong = game.add.audio('win', 1);
    boom = game.add.audio('boom', 1);

    intromusic.play();
    //give player physics property
    game.physics.arcade.gravity.y = GRAVITY;
	//setting player's initial position
	player = game.add.sprite(PLAYER_START.x, PLAYER_START.y, 'player');
    player.life = PLAYER_LIFE;
    //adding physics to player
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.collideWorldBounds = true;
    
    //adding princess image
    princess = game.add.sprite(250, 40, 'lady');
    princess.scale.setTo(1.3, 1.3);
    game.physics.enable(princess, Phaser.Physics.ARCADE);

    bacBottom = game.add.sprite(0, 620, 'bacBottom');
    game.physics.enable(bacBottom, Phaser.Physics.ARCADE);
    bacBottom.body.gravity = 0;

    //create barrels group object
    barrels = addGroup(barrels, 10, 'barrel');
    barrels.scale.setTo(1.2, 1.2);

    blueBarrels = addGroup(blueBarrels, 20, 'blueBarrel');
    blueBarrels.scale.setTo(1.2, 1.2);
    game.physics.enable(blueBarrels, Phaser.Physics.ARCADE);

    heart = game.add.sprite(300, 30, 'heart');
    beat = heart.animations.add('beat');
    heart.visible = false;
    heart.scale.setTo(0.2, 0.2);

    //add donkeykong animation
    donkeykong = game.add.sprite(25, 7, 'donkk');
    donkeykong.scale.setTo(0.4, 0.4);
    donkeykong.animations.add('move');

    explosion = game.add.sprite(player.x, player.y, 'explode');
    boomboom = explosion.animations.add('boomboom');
    explosion.visible = false;
    boomboom.onComplete.add(explosionFinished, this);
    explosion.scale.setTo(0.2, 0.2);

    //animations, walking left, right, and up.
    player.animations.add('left', [4,5,6,7], 10, true);
    player.animations.add('right', [8,9,10,11], 10, true);
    player.animations.add('up', [12,13,14,15], 10, true);
    player.animations.add('down', [12,13,14,15], 10, true);

    //platforms contain ledges
    platforms = game.add.group();
    platforms.enableBody = true;
        
    //create ledges
	ledge = platforms.create(-100, 68, 'boxes');
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

	ledge = platforms.create(100, 150, 'boxes');
   // game.add.tween(ledge).to( { angle: -3 }, 1000, Phaser.Easing.Linear.None, true);
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    ledge = platforms.create(180, 230, 'boxes');
   // game.add.tween(ledge).to( { angle: -3 }, 1000, Phaser.Easing.Linear.None, true);
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    ledge = platforms.create(-150, 310, 'boxes');
   // game.add.tween(ledge).to( { angle: 3 }, 1000, Phaser.Easing.Linear.None, true);
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    ledge = platforms.create(200, 420, 'boxes');
  //  game.add.tween(ledge).to( { angle: -3 }, 1000, Phaser.Easing.Linear.None, true);
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    ledge = platforms.create(-100, 500, 'boxes');
   // game.add.tween(ledge).to( { angle: 3 }, 1000, Phaser.Easing.Linear.None, true);
    ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    ledge = platforms.create(80, 580, 'boxes');
   // game.add.tween(ledge).to( { angle: -3 }, 1000, Phaser.Easing.Linear.None, true);
  	ledge.scale.setTo(0.8, 0.8);
    ledge.body.immovable = true;

    platforms.setAll('body.allowGravity', false);

    //adding a single box where a barrel hits after coming down through ladders
    boxesHit = game.add.group();
    boxesHit.enableBody = true;

    boxhit = boxesHit.create(100, 150, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(320, 150, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(220, 230, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(180, 310, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(240, 420, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(195, 500, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(250, 580, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxhit = boxesHit.create(320, 580, 'boxhit');
    boxhit.body.immovable = true;
    boxhit.scale.setTo(0.8, 0.8);

    boxesHit.setAll('body.allowGravity', false);

  	//ladders contains bunch of ladder
	ladders = game.add.group();
    ladders.enableBody = true;
    //creating ladders
	ladder = ladders.create(100, 60, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

    ladder = ladders.create(320, 60, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

	ladder = ladders.create(230, 150, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

    ladder = ladders.create(180, 230, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

	ladder = ladders.create(250, 310, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

    ladder = ladders.create(250, 336, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

	ladder = ladders.create(200, 420, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

	ladder = ladders.create(250, 500, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

	ladder = ladders.create(320, 500, 'ladder');
    ladder.body.immovable = true;
    ladder.scale.setTo(0.1, 0.1);

    ladders.setAll('body.allowGravity', false);

    ladder_pieces = game.add.group();
    ladder_pieces.enableBody = true;
    //creating ladders
    ladder_piece = ladder_pieces.create(100, 125, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(320, 125, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(230, 215, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(180, 295, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(250, 400, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(200, 485, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(250, 565, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_piece = ladder_pieces.create(320, 565, 'ladder2');
    ladder_piece.body.immovable = true;
    ladder_piece.scale.setTo(0.1, 0.1);

    ladder_pieces.setAll('body.allowGravity', false);

  	//create keyboard manager
  	cursors = game.input.keyboard.createCursorKeys();
  	//adding SPACE bar for the jump
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //play button with action
    button = game.add.button(game.world.centerX - 140, 250, 'button', actionOnClick);
   
    function actionOnClick(){
    //button disappears
    button.destroy();
    startGame = true;
    //background music loop starts
    intromusic.stop();
    backgroundMusic = setInterval(function(){ bacmusic.play(); }, 1150);
    spawnBarrels = game.time.events.loop(Phaser.Timer.SECOND * 1.5, spawnBarrels);  
    spawnBlueBarrels = game.time.events.loop(Phaser.Timer.SECOND * 1.8, spawnBlueBarrels); 
    }

    window.addEventListener('keydown', function(e){
        //spacebar has keyCode of 32
    if(e.keyCode === 32){
        jumpCounter++;
        console.log(jumpCounter);

        if(jumpCounter > 1){
        player.body.velocity.y = 0;
        setTimeout(function(){
        jumpCounter = 0;
        }, 1000)
        }
    }
    })

    //display player.life
    createText();
}

function update() {
if(!startGame){
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(princess, platforms);
}
else if(startGame){
    //resets player life
    textLife.text = '💓 X ' + player.life; 
    //donkeykong animation plays from start to end
    donkeykong.animations.play('move', 5, true);
    //princess will always stay on top
    game.physics.arcade.collide(princess, platforms);
    //mario has collision with the boxesHit
    game.physics.arcade.collide(player, boxesHit);
    //blueBarrels always follow platforms (not falling through platforms)
    game.physics.arcade.collide(blueBarrels, platforms);
    //reset ladder status
    onLadders = false;
    onPlatforms = true;
    barrelsOnLadders = false;
    reachedEnd = false;
    player.body.gravity.y = GRAVITY;
    
    ladders.forEach(function(ladder){
        game.physics.arcade.overlap(player, ladder, isOnLadders);
    });

    //keeping player in front of other sprites
	game.world.bringToTop(player);

	//Reset the players velocity (movement)
    player.body.velocity.x = 0;


    if (cursors.left.isDown){
        //Move to the left
        player.body.velocity.x = -PLAYER_SPEED;
        player.animations.play('left');
    }
    else if (cursors.right.isDown){
        //Move to the right
        player.body.velocity.x = PLAYER_SPEED;
        player.animations.play('right');
    }
    else if (!cursors.up.isDown && !cursors.down.isDown && !cursors.right.isDown && !cursors.left.isDown){
        //Stand still when no keyboard key is pressed
        player.animations.stop();
        player.frame = 0;
    }
    
    if(onLadders){ 
            //when player is on ladder, disable collision between player and ledge
            platforms.forEach(function(ledge){
                game.physics.arcade.overlap(player, ledge);
            })
            if(cursors.up.isDown){
                player.body.velocity.y = -PLAYER_SPEED/2;
                player.animations.play('up');
            }
            if(cursors.down.isDown){
                player.body.velocity.y = PLAYER_SPEED/2;
                player.animations.play('down');
            }
            if(!cursors.up.isDown && !cursors.down.isDown){
                player.body.velocity.y=0;
                player.body.gravity.y=0;
                //when player is not moving, enable collision between player and ledge
                platforms.forEach(function(ledge){
                game.physics.arcade.collide(player, ledge, isOnPlatforms);
                })
            }  
        } 
    else {
        //if player is NOT on the ladder, enable collision between player and platforms    
        platforms.forEach(function(ledge){
        game.physics.arcade.collide(player, ledge, isOnPlatforms);
        })
    }
     	//Allow the player to jump if they are touching the ground.

    if (jumpButton.isDown && jumpCounter != 1){
        player.body.velocity.y = -PLAYER_SPEED;
        jumping.play();
        //add jump limits
    }
    
    
    barrels.forEach(function(barrel){
        barrel.isOnLadders = false;
        game.physics.arcade.overlap(barrel, ladders, barrelsAreOnLadders);
        if (!barrel.isLanded) {
            game.physics.arcade.collide(barrel, boxesHit, moveBarrels);
        }

        if(!barrel.isOnLadders){
            game.physics.arcade.collide(barrel, platforms);
        } 
    });

    blueBarrels.forEach(function(blueBarrel){
        game.physics.arcade.overlap(blueBarrel, bacBottom, removeBlueBarrels);
        
    })

   game.physics.arcade.overlap(player, princess, winCeremony);
   game.physics.arcade.overlap(player, barrels, damagePlayer);
   game.physics.arcade.overlap(player, blueBarrels, damagePlayer);

}
}

function explosionFinished(boomboom, animation){
    explosion.visible = false;
    explosion.animations.stop(null, true);

}

function isOnLadders(){
    onLadders = true;
}

function isOnPlatforms(){
    onPlatforms = false;
}

function barrelsAreOnLadders(barrel){
    barrel.isOnLadders = true;
    barrel.isLanded = false;
    barrel.body.velocity.x = 0;
}

function moveBarrels(barrel, boxesHit){
    barrel.isLanded = true;
    barrel.isOnLadders = false;
    var rand = Math.random();
    if (rand < 0.5) {
        barrel.body.velocity.x = BARREL_VELOCITY.x;
    } else {
        barrel.body.velocity.x = -BARREL_VELOCITY.x;
    }
}

function reachedEnd(){
    reachedEnd = true;
}

function removeBlueBarrels(blueBarrel){
    blueBarrel.destroy();
}

// function render(){

//     game.debug.body(bacBottom);
 
//      // boxesHit.forEach(function(boxhit){
//      //    game.debug.body(boxhit);
//      // });
// }
