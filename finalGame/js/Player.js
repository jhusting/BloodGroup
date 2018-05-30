function Player(game, key)
{
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.world.width/2 , game.world.height/2 - 64, 'atlas', key);

	this.anchor.set(0.5);

	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 3, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('pl_LeftIdle', 1, 2, '', 2), 3, true);
	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('pl_RightRun', 2, 12, '', 2), 22, true);
	this.animations.add('rightRun_Hurt', Phaser.Animation.generateFrameNames('pl_RightRun', 2, 12, '', 2), 10, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('pl_LeftRun', 2, 12, '', 2), 22, true);
	this.animations.add('leftRun_Hurt', Phaser.Animation.generateFrameNames('pl_LeftRun', 2, 12, '', 2), 10, true);
	this.animations.play('rightIdle');

	game.physics.arcade.enable(this);

	this.body.collideWorldBounds = true;
	this.body.drag.x = 1200;
	this.body.drag.y = 1200;

	this.speed = 200;
	this.diagRatio = 1.35;
	this.wasDown = false;
	this.fire = false;
	this.z = 100;
	this.canFire = 0;
	this.shotSound = game.add.audio('playerShot');

	this.starveBar = game.add.image(0, 0, 'pBlood');
	this.starveScale = 125;
	this.starveBar.scale.set(125, 6);
	this.starveBar.alpha = 0;
	this.starveBar.fixedToCamera = true;
	this.starveBar.cameraOffset = new Phaser.Point(100, 650);

	this.emitter = game.add.emitter(this.x, this.y, 3);
	this.emitterCounter = 0;
	this.emitter.minParticleAlpha = .65;
	this.emitter.maxParticleAlpha = .65;
	this.emitter.lifespan = 125;
	this.emitter.explode = false;
	this.emitter.quantity = 4;
	this.emitter.visible = true;
	this.emitter.minRotation = 0;
	this.emitter.maxRotation = 0;
	this.emitter.gravity = 0;
	//this.emitter.start(false, 1);

	this.dead = false;
	this.melee = false;
	this.gaunt = false;
	this.eating = false;
	this.onBlood = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	this.bringToTop();
	if(this.canFire < 5)
		this.canFire++;

	if(this.gaunt && this.onBlood)
	{
		this.speed = 125;
		this.emit();
	}
	else if(this.gaunt)
		this.speed = 70;
	else if(this.onBlood)
	{
		this.speed = 300;
		this.emit();
	}
	else
		this.speed = 200;

	if(this.gaunt)
	{
		if(this.eating && this.starveScale < 125)
			this.starveScale += .3;
		else if(this.onBlood)
			this.starveScale -= .1;
		else if(!this.eating)
			this.starveScale -= .4;

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

Player.prototype.emit = function()
{
	if(this.emitterCounter > 7)
	{
		this.emitter.x = this.x;
		this.emitter.y = this.y;
		if(this.gaunt)
		{
			this.emitter.maxParticleSpeed.setTo(-this.body.velocity.x/1.5, -this.body.velocity.y/1.5);
			this.emitter.minParticleSpeed.setTo(-this.body.velocity.x/1.5, -this.body.velocity.y/1.5);
		}
		else
		{
			this.emitter.maxParticleSpeed.setTo(-this.body.velocity.x/3.25, -this.body.velocity.y/3.25);
			this.emitter.minParticleSpeed.setTo(-this.body.velocity.x/3.25, -this.body.velocity.y/3.25);
		}

		this.emitter.makeParticles('atlas', this.frame);
		this.emitter.emitParticle(this.x, this.y, 'atlas', this.frame);
		this.emitterCounter = 0;
	}
	else
		this.emitterCounter++;
}

Player.prototype.dying = function()
{
	var timer = game.time.create(true);
	game.deadText = game.add.text(player.x - 150, player.y - 160, 
			'You died.', textStyle);
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

	player.shotSound.play('', 0, .25, false);

	player.gaunt = true;
}

