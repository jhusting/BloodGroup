function Player(game, key)
{
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, 16*32 - 16, 24*32 - 16, 'atlas', key);

	this.anchor.set(0.5);

	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 4, '', 2), 6, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('pl_LeftIdle', 1, 4, '', 2), 6, true);
	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('pl_RightRun', 1, 7, '', 2), 18, true);
	this.animations.add('rightRun_Hurt', Phaser.Animation.generateFrameNames('pl_RightRun', 1, 7, '', 2), 10, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('pl_LeftRun', 1, 7, '', 2), 18, true);
	this.animations.add('leftRun_Hurt', Phaser.Animation.generateFrameNames('pl_LeftRun', 1, 7, '', 2), 10, true);
	this.animations.play('rightIdle');

	game.physics.arcade.enable(this);

	this.body.collideWorldBounds = true;
	this.body.drag.x = 1200;
	this.body.drag.y = 1200;

	this.speed = 250;
	this.diagRatio = 1.35;
	this.wasDown = false;
	this.fire = false;
	this.z = 100;
	this.gaunt = false;
	this.canFire = 0;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	this.bringToTop();
	if(this.canFire < 5)
		this.canFire++;
	if(game.input.mousePointer.isDown)
	{
		this.wasDown = true;
	}
	if(game.input.mousePointer.isUp && this.wasDown)
	{
		this.wasDown = false;
		if(!this.gaunt && this.canFire > 4)
			fire(this);
	}
	if(!game.input.mousePointer.isDown)
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.W)) 
		{
			if(Math.abs(this.body.velocity.x) == 0)
				this.body.velocity.y = -this.speed;
			else 
				this.body.velocity.y = -this.speed/this.diagRatio;
		}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.S)) 
		{
			if(Math.abs(this.body.velocity.x) == 0)
				this.body.velocity.y = this.speed;
			else
				this.body.velocity.y = this.speed/this.diagRatio;
		}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.A)) 
		{
			if(Math.abs(this.body.velocity.y) == 0)
				this.body.velocity.x = -this.speed;
			else
				this.body.velocity.x = -this.speed/this.diagRatio;

			if(!this.gaunt)
				this.animations.play('leftRun');
			else
				this.animations.play('leftRun_Hurt');
		}
		
		if(game.input.keyboard.isDown(Phaser.Keyboard.D)) 
		{
			if(Math.abs(this.body.velocity.y)  == 0)
				this.body.velocity.x = this.speed;
			else
				this.body.velocity.x = this.speed/this.diagRatio;
			
			if(!this.gaunt)
				this.animations.play('rightRun');
			else
				this.animations.play('rightRun_Hurt');
		}
	}

	if(game.input.keyboard.lastChar == 'a' && this.body.velocity.x == 0)
	{
			this.animations.play('leftIdle');
	}
	else if (this.body.velocity.x == 0 && this.body.velocity.y == 0)
	{
			this.animations.play('rightIdle');
	}
}

function fire(player)
{
	var bullet = new Bullet(player.x, player.y, game.input.worldX, game.input.worldY, game);
	game.add.existing(bullet);

	player.gaunt = true;
	player.speed = 75;
}

