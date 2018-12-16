# week1_project_kelly
# First Game Project - Donkey Kong!  

The original Donkey Kong game is one of my favorite old-school reminiscent games and I wanted to recreate this in my style. 
There were some technical and time retrictions to realize and implement all my ideas but I will definitely edit and expand this game for more challenging and fun user experiences!

## Initial Ideation

Before decising which game to actually make or recreate, I did a rough search to make sure that there are enough resources to support realization of my idea. 
I love to design and create my own stuff but I wanted to spend more time on the game logics in my first project. 

Once I made a decision to build Donkey Kong game, I watched the game on Youtube to analyze and list functions and conditions to create: 
    * Donkey Kong throws the barrels from the top
    * All barrels have to move down (preferably in random patterns)
    * Mario only gets certain amount of lives and he loses one everytime he gets hit by a barrel 
    * Mario must be able to move left and right, and up and down the ladders, and jump over the barrels
    * Mario wins when he meets the princess in the top floor
    
*Forgot what the original game looks like?* 
Here is the link! [DONKEY KONG] (https://www.youtube.com/watch?v=U24OcmpZ6fA)

    
Plus, as this is an old-school game from "back in the day", I wanted to maintain the vintage vibes through 8-bit graphic/animations, sounds, and the background of the webpage. 
I used Phaser2.2.2 to build the arcade. 

## Put Things Together

As a first timer game maker, I laid out all images that I collected and edited in the background and they seemed to work fine... until I started to really dive deeper into game logics.
I laid out each ledge and ladder individually by assigning a 'x' & 'y' coordinates. 

```
function create() {
  //platforms contain ledges
  platforms = game.add.group();
  platforms.enableBody = true;
  platforms.setAll('body.allowGravity', false);

  //create ledges
  ledge = platforms.create(-100, 68, 'boxes');
  ledge.body.immovable = true;

  ledge = platforms.create(100, 150, 'boxes');
  ledge.body.immovable = true;
}
```

I initially wanted to give a slight slope to each ledge so it looks more natural for barrels to roll down. 
But, when I used tween(Phaser2) to create an angle, it turned ledge into a huge rectangular sprite with all empty spaces instead of tilting itself. 
That huge rectangular sprite box was blocking Mario's movement and figured it couldn't be solved with Phaser unless I implement the tile-map method.
This is when I first realized about the convenience of the tile-map.. 
Slope was supposed to be an extra-oomph therefore I decided to move on. 
```
game.add.tween(ledge).to( { angle: 3 }, 1000, Phaser.Easing.Linear.None, true);
```
## Make Things Work

Once I got the background, ledges, and ladders ready, I added a player, Mario, and barrels in the game.
This is when I hit the first struggle. 
I set the collision between barrels and a player against the ledges (under "platforms" object group) so they could both move on top of them and set an overlap function between barrels and ladders, 
and a player and ladders because they both move through ladders. Sadly, it wasn't that easy. 
What that means is, Mario has to still pass through the thickness of the platform while he moves on the ladder without sinking down or falling once he reaches the top of the platform that still overlaps with the ladder.
As a solution, I created a function that updates the status to true and disable the collision between the player and the ledge only when the player is on the ladder and vice versa for when he is back on platform to reactivate the collision. 
This is how I mimicked a partial collision and similarly applied to barrels as well.  
```
function update() {
onLadders = false;
onPlatforms = true;

if(onLadders){ 
    //when player is on the ladder, disable collision between player and ledge (allowing him to pass through)
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
 function isOnLadders(){
    onLadders = true;
}
function isOnPlatforms(){
    onPlatforms = false;
}
```

## Conclusion
I had lots of fun making a game of my choice. I was very excited to witness the changes I make in every step.
It was an awesome opportunity to develop my thinking process more like a developer. 
The game logic literally requires every single steps of 'do's and 'don't's of every single sprites that make interactions in the game.
Another fun part was that I was able to come up with multiple alternatives to make the logic work. 
If one approach doesn't do the trick, I could make it work with anoter approach eventually! (second pair of eyes help!!) - there is no right or wrong way of doing it. 
 
## Built With: 
* HTML
* CSS
* JavaScript
* Phaser

## External Sources: 
* GIMP 
* Google Fonts

## Character Credits: 
* Nintendo
