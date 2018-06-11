function Bullet(x1, y1, x2, y2, game)
{
	Phaser.Sprite.call(this, game, x1, y1, 'atlas', 'bloodBullet');

	this.anchor.set(0.5);
	this.scale.set(0.75);

	game.physics.arcade.enable(this);
	game.physics.arcade.moveToXY(this, x2, y2, 700);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function()
{
	var intersects = bigRoom.walls.getTiles(this.x, this.y, 4, 4, true); //gets all the tiles less than 4 pixels away from this.x, this.y 
	var hitEnemy = game.physics.arcade.overlap(this, enemies, destroyEnemy, null, this); //tests if the bullet is overlapping with an enemy

	if( intersects.length > 0 || hitEnemy ||
		this.x < 0 || this.x > game.world.width||
	 	this.y < 0 || this.y > game.world.height)
	{
		//if this bullet is on a tile, or outside the world bounds, destroy it
		this.destroy();
	}

	//makes 4 blood particles, adds them to the blood group
	for(var i = 0; i < 4; i++)
	{
		var part = game.add.sprite(	this.x - 16+ Math.random()*16, 
									this.y - 16 + Math.random()*16, 'pBlood');
		part.scale.set(4, 4);
		part.outOfBoundsKill = true;
		part.lifespan = 10000; //this particle will destroy itself after 10 seconds
		game.physics.arcade.enable(part);
		bloods.add(part); //adds it to the blood group
	}
}

function destroyEnemy(bullet, enemy) //handles when the bullet kills an enemy
{
	//spawn a puddle, 50/50 between two puddle sprites
	var puddle;
	if(Math.random()*100 < 50)
		puddle = game.add.sprite(enemy.x, enemy.y, 'atlas', 'puddle1');
	else
		puddle = game.add.sprite(enemy.x, enemy.y, 'atlas', 'puddle2');
	puddle.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(puddle);
	bloods.add(puddle);

	//spawns a corpse
	var corpse = new Corpse(game, 1, 0, enemy.x, enemy.y);
	game.add.existing(corpse);
	corpses.add(corpse);

	//deletes the exclamation point if its there
	if(enemy.seen != null)
		enemy.seen.destroy();

	enemy.X.destroy();
	enemy.graphics.destroy();
	enemy.destroy();
}