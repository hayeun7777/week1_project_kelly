function createText(){
	textLife = game.add.text(10, 100, '💓 X ' + player.life, {fill: 'red'});

}

function gameOver(){
startGame = false;
clearInterval(backgroundMusic);
}

