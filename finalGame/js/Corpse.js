function Corpse(game, scale, rotation, x, y)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'corpse');

	this.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(this);

	/*this.key = game.input.keyboard.addKey(Phaser.KeyCode.E);
	this.key.onDown.add( function()
	{
		if(this != null)
			var dist = Phaser.Math.distance(player.x, player.y, this.x, this.y,);
		else var dist = 100;
		//console.log('Distance: ' + dist + '\nPlayerx: ' + player.x + '\nthisx: ' + this.x);
		if(dist < 64)
		{
			player.gaunt = false;
			player.speed = 250;
			this.destroy();
		}
	}, this);*/

	this.heldTime = 0;
	this.bar = game.add.sprite(this.x, this.y - 32, 'pBlood');
	this.bar.anchor.set(0.5);
	this.bar.scale.set(0, 1);
}

Corpse.prototype = Object.create(Phaser.Sprite.prototype);
Corpse.prototype.constructor = Corpse;

Corpse.prototype.update = function()
{
	var playerOn = game.physics.arcade.overlap(this, player);
	if(playerOn && game.input.keyboard.isDown(Phaser.Keyboard.E))
	{
		this.heldTime++;
		this.bar.scale.set((this.heldTime/60)*16, 1);
		if(this.heldTime > 60)
		{
			player.gaunt = false;
			player.speed = 250;
			this.bar.destroy();
			this.destroy();
		}
	}
	else
	{
		this.bar.scale.set(0, 1);
		this.heldTime = 0;
	}
}