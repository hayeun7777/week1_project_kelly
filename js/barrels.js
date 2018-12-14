function addGroup(object, numToCreate, spriteName){
	object = game.add.group();
	object.enableBody = true
	object.physicsBodyType = Phaser.Physics.ARCADE;
	object.createMultiple(numToCreate, spriteName); //create 20 different laser objects on the screen
	object.setAll('outOfBoundsKill', true);
	object.setAll('checkWorldBounds', true);

	return object;
}

function spawnBarrels(){
	var barrel = barrels.getFirstExists(false);
	barrel.reset(25, 7, game.rnd.integerInRange(-10, GAME_HEIGHT, 10));
	barrel.body.velocity.x = game.rnd.integerInRange(200, BARREL_VELOCITY.x);
	barrel.body.velocity.y = game.rnd.integerInRange(-100, BARREL_VELOCITY.y);
	barrel.isOnLadder = false;
	barrel.isLanded = false;
}

function spawnBlueBarrels(){
	var blueBarrel = blueBarrels.getFirstExists(false);
	blueBarrel.body.collideWorldBounds = true;
	blueBarrel.body.bounce.set(0.8);
	blueBarrel.reset(350, 50);
	blueBarrel.body.velocity.setTo (-250, 180);
	//adding random bounce to barrels
	blueBarrel.body.bounce.y = 0.4 + Math.random() * 0.1;
}

function damagePlayer(p, barrel, blueBarrel){
		//player loses a life if he get hit by any barrel
		explode();
		barrel.kill();
		player.life -= 1;
		textLife.text = '💓 X ' + player.life; 
		//when he is done with his life count, game is over
		if (player.life <= 0){
			player.kill();
			gameOver();
			dead.play();
			replay = game.add.button(game.world.centerX - 140, 250, 'replay', actionOnClick);
		function actionOnClick(){
		//button disappears
		replay.destroy();
		startGame = true;
		player.reset(PLAYER_START.x, PLAYER_START.y);
	    player.life = PLAYER_LIFE;
	    backgroundMusic = setInterval(function(){ bacmusic.play(); }, 1150);
		}					
		}
}

function winCeremony(p, princess){
	if(player.life >= 1 ){
		player.animations.stop();
        player.body.velocity.x = 0;
        beat.onComplete.add(heartFinished, this);
        winHeart();
		gameOver();

	winMsg = game.add.button(game.world.centerX - 140, 250, 'winMsg', actionOnClick);
	function actionOnClick(){
	//button disappears
	winMsg.destroy();
	startGame = true;
	player.reset(PLAYER_START.x, PLAYER_START.y);
    player.life = PLAYER_LIFE;
    backgroundMusic = setInterval(function(){ bacmusic.play(); }, 1150);
	}
	}
}


function explode(){
	explosion.x = player.x;
	explosion.y = player.y;
	explosion.visible = true;
	explosion.animations.play('boomboom', 10, false);
	boom.play();
}

function winHeart(){
	heart.x = 300;
	heart.y = 30;
	heart.visible = true;
	heart.animations.play('beat', 5, false);
	winSong.play();
}

function heartFinished(beat, animation){
    heart.visible = false;
    heart.animations.stop(null, true);
}

