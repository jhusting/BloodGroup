function Corpse(game, scale, rotation, x, y)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'corpse');

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