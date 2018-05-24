function Player(game, key)
{
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.world.width/2 , game.world.height/2 - 64, 'atlas', key);

	this.anchor.set(0.5);

	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 3, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('pl_LeftIdle', 1, 2, '', 2), 3, true);
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
	this.canFire = 0;

	this.starveBar = game.add.image(0, 0, 'pBlood');
	this.starveScale = 125;
	this.starveBar.scale.set(125, 6);
	this.starveBar.alpha = 0;
	this.starveBar.fixedToCamera = true;
	this.starveBar.cameraOffset = new Phaser.Point(100, 650);

	this.dead = false;
	this.melee = false;
	this.gaunt = false;
	this.eating = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	this.bringToTop();
	if(this.canFire < 5)
		this.canFire++;
	if(this.gaunt)
	{
		if(!this.eating)
			this.starveScale -= .25;
		else if(this.starveScale < 125)
			this.starveScale += .5;

		this.starveBar.alpha = 1;
		if(this.starveScale <= 0)
		{
			this.starveScale = 0;
			this.dead = true;
			this.dying();
		}

		if(this.starveScale < 50)
		{
			if(this.starveScale%5 < 2.5)
				this.starveBar.alpha = 400;
			else
				this.starveBar.alpha = 1;
		}

		this.starveBar.scale.set(this.starveScale, 6);
	}
	else
	{
		this.starveBar.alpha = 0;
		this.starveScale = 125;
	}
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
	if(!this.dead && !this.melee && !game.input.mousePointer.isDown)
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

Player.prototype.dying = function()
{
	var timer = game.time.create(true);
	game.deadText = game.add.text(player.x - 150, player.y - 160, 
			'You died.\nPress Space to Restart!', 
			{font: 'Charter', fontSize: '36px', fill: '#ffffff', backgroundColor: '0'});
	//text.alpha = 0;

	timer.add(2000, function() {
		game.state.start('Dead');
	}, this);

	timer.start();
}

function fire(player)
{
	var bullet = new Bullet(player.x, player.y, game.input.worldX, game.input.worldY, game);
	game.add.existing(bullet);

	player.gaunt = true;
	player.speed = 75;
}

