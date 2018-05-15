function Corpse(game, scale, rotation, x, y)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'corpse');

	this.anchor.set(0.5, 0.5);

	this.key = game.input.keyboard.addKey(Phaser.KeyCode.E);
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
	}, this);
}

Corpse.prototype = Object.create(Phaser.Sprite.prototype);
Corpse.prototype.constructor = Corpse;