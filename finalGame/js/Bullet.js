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
	//var hitWall = game.physics.arcade.collide(this, bigRoom.walls);
	var intersects = bigRoom.walls.getTiles(this.x, this.y, 4, 4, true);
	var hitEnemy = game.physics.arcade.overlap(this, enemies, destroyEnemy, null, this);

	if( intersects.length > 0 || hitEnemy ||
		this.x < 0 || this.x > game.world.width||
	 	this.y < 0 || this.y > game.world.height)
	{
		this.destroy();
	}

	for(var i = 0; i < 4; i++)
	{
		var part = game.add.sprite(	this.x - 16+ Math.random()*16, 
									this.y - 16 + Math.random()*16, 'pBlood');
		part.scale.set(4, 4);
		part.outOfBoundsKill = true;
		part.lifespan = 10000;
		game.physics.arcade.enable(part);
		bloods.add(part);
	}
}

function destroyEnemy(bullet, enemy)
{
	var corpse = new Corpse(game, 1, 0, enemy.x, enemy.y);
	game.add.existing(corpse);

	if(enemy.seen != null)
		enemy.seen.destroy();

	enemy.X.destroy();
	enemy.graphics.destroy();
	enemy.destroy();
}