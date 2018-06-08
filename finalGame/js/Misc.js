function Arrow(game, target, scale, rotation, x, y)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'arrow');

	this.anchor.set(0, 0.5);
	game.physics.arcade.enable(this);

	this.stairLine = new Phaser.Line(this.x, this.y, game.world.width/2, game.world.height/2);
	this.rotation = rotation;
	this.target = target;
}

Arrow.prototype = Object.create(Phaser.Sprite.prototype);
Arrow.prototype.constructor = Arrow;

Arrow.prototype.update = function()
{
	this.x = player.x;
	this.y = player.y;

	this.stairLine = new Phaser.Line(this.x, this.y, this.target.x, this.target.y);

	if(this.stairLine.length > 180)
	{
		this.alpha = 1;
		this.rotation = this.stairLine.angle;
	}
	else
		this.alpha = 0;
};

function Corpse(game, scale, rotation, x, y)
{
	if(Math.random()*100 < 50)
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'skull');
	else
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'ribs');

	numEnemies--;

	this.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(this);

	this.heldTime = 0;
	this.bar = game.add.sprite(this.x, this.y - 32, 'pBlood');
	this.bar.anchor.set(0.5);
	this.bar.scale.set(0, 1);
}

Corpse.prototype = Object.create(Phaser.Sprite.prototype);
Corpse.prototype.constructor = Corpse;
