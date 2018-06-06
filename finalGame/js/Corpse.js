function Corpse(game, scale, rotation, x, y)
{
	if(Math.random()*100 < 50)
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'skull');
	else
		Phaser.Sprite.call(this, game, x, y, 'atlas', 'ribs');

	numEnemies--;
	console.log(numEnemies);

	this.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(this);

	this.heldTime = 0;
	this.bar = game.add.sprite(this.x, this.y - 32, 'pBlood');
	this.bar.anchor.set(0.5);
	this.bar.scale.set(0, 1);
}

Corpse.prototype = Object.create(Phaser.Sprite.prototype);
Corpse.prototype.constructor = Corpse;

Corpse.prototype.update = function()
{
	
};