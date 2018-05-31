function Player(game, key)
{
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, game.world.width/2 , game.world.height/2 - 64, 'atlas', key);

	this.anchor.set(0.5);

	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 3, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('pl_LeftIdle', 1, 2, '', 2), 3, true);

	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('pl_RightRun', 2, 12, '', 2), 22, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('pl_LeftRun', 2, 12, '', 2), 22, true);
	this.animations.add('upRun', Phaser.Animation.generateFrameNames('pl_UpRun', 2, 12, '', 2), 22, true);
	this.animations.add('downRun', Phaser.Animation.generateFrameNames('pl_DownRun', 2, 12, '', 2), 22, true);

	this.animations.add('rightRun_Hurt', Phaser.Animation.generateFrameNames('pl_RightRun', 2, 12, '', 2), 10, true);
	this.animations.add('leftRun_Hurt', Phaser.Animation.generateFrameNames('pl_LeftRun', 2, 12, '', 2), 10, true);
	this.animations.add('upRun_Hurt', Phaser.Animation.generateFrameNames('pl_UpRun', 2, 12, '', 2), 10, true);
	this.animations.add('downRun_Hurt', Phaser.Animation.generateFrameNames('pl_DownRun', 2, 12, '', 2), 10, true);

	this.animations.add('rightShoot', Phaser.Animation.generateFrameNames('pl_RightShoot', 1, 9, '', 2), 30, false);
	this.animations.add('leftShoot', Phaser.Animation.generateFrameNames('pl_LeftShoot', 1, 9, '', 2), 30, false);

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
	this.shotCounter = 0;

	this.starveFill = game.add.image(0, 0, 'atlas', 'healthBarFill');
	this.starveFill.anchor.set(0.5, 1);
	this.starveFill.alpha = 0;
	this.starveFill.fixedToCamera = true;
	this.starveFill.cameraOffset = new Phaser.Point(32, 544);
	game.physics.arcade.enable(this.starveFill);

	this.starveBar = game.add.image(0, 0, 'atlas', 'healthBar1');
	this.starveBar.alpha = 0;
	this.starveBar.fixedToCamera = true;
	this.starveBar.cameraOffset = new Phaser.Point(16, 150);
	game.physics.arcade.enable(this.starveBar);

	this.starveScale = 100;
	this.starveCracks = 1;

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

	this.shootingPart = game.add.sprite(this.x - 20, this.y + 14, 'atlas', 'shootingPart');
	this.shootingPart.anchor.set(0.5, 1);
	this.shootingPart.alpha = 0;

	this.shootingBar = game.add.sprite(this.x - 24, this.y - 16, 'atlas', 'shootingBar');
	this.shootingBar.alpha = 0;

	this.dead = false;
	this.melee = false;
	this.gaunt = false;
	this.eating = false;
	this.onBlood = false;
	this.shooting = false;
	this.facingRight = true;
	this.facingUp = false;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	this.bringToTop();
	this.starveFill.bringToTop();
	this.starveBar.bringToTop();

	var onCorpse = game.physics.arcade.overlap(this, corpses, eat, null, this);

	if(!onCorpse)
		this.eating = false;

	if(this.canFire < 5)
		this.canFire++;

	this.shootingPart.x = this.x - 20;
	this.shootingPart.y = this.y + 14;
	this.shootingBar.x = this.x - 24;
	this.shootingBar.y = this.y - 16;

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
		if(this.eating)
		{
			this.starveScale += .2;
			if (this.starveScale > 100)
				this.starveScale = 100;
		}
		else if(this.onBlood)
			this.starveScale -= .2;
		else if(!this.eating)
			this.starveScale -= .4;

		if(	(this.starveScale < 80 && this.starveCracks == 1) ||
			(this.starveScale < 60 && this.starveCracks == 2) ||
			(this.starveScale < 40 && this.starveCracks == 3) || 
			(this.starveScale < 20 && this.starveCracks == 4) )
		{
			this.wobble();
			this.starveCracks++;
			
			this.starveBar.frameName = 'healthBar' + this.starveCracks;
		}

		this.starveBar.alpha = 1;
		this.starveFill.alpha = 1;
		if(this.starveScale <= 0 && !this.dead)
		{
			this.starveScale = 0;
			this.dead = true;
			this.dying();
			this.starveBar.frameName = 'healthBar0';
		}

		if(this.starveScale < 50)
		{
			if(this.starveScale%3 < 1.5)
				this.starveFill.alpha = 400;
			else
				this.starveFill.alpha = 1;
		}

		var height = 400*(this.starveScale/100);
		if(height < 0)
			height = 0;
		this.starveFill.crop(new Phaser.Rectangle(this.starveFill.worldX - 16, this.starveFill.worldY - height, 32, height));
	}
	else
	{
		this.starveBar.alpha = 0;
		this.starveFill.alpha = 0;
		this.starveScale = 100;
		this.starveCracks = 1;
		this.starveBar.frameName = 'healthBar1';
	}

	if(game.input.mousePointer.isDown)
	{
		if(!this.shooting && !this.gaunt && this.canFire > 4)
			fire(this);
	}

	if(!this.shooting && !this.dead && !this.melee && !game.input.mousePointer.isDown)
		this.processInput();

	if(game.input.mousePointer.isDown && this.shooting)
	{
		this.shotCounter++;
		this.shootingBar.alpha = 1;
		this.shootingPart.alpha = 1;

		this.shootingPart.scale.set( 1, (this.shotCounter/22) * 6 );

		if(this.shotCounter == 22)
		{
			this.makeBullet();
		}

		if(this.animations.currentAnim.isFinished)
		{
			this.shootingBar.alpha = 0;
			this.shootingPart.alpha = 0;
			this.shotCounter = 0;
			this.shooting = false;
		}
	}
	else
	{
		this.shootingBar.alpha = 0;
		this.shootingPart.alpha = 0;
		this.shotCounter = 0;
		this.shooting = false;

		this.pickAnimation();
	}
};

Player.prototype.processInput = function ()
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
	}
		
	if(game.input.keyboard.isDown(Phaser.Keyboard.D)) 
	{
		if(Math.abs(this.body.velocity.y)  == 0)
			this.body.velocity.x = this.speed;
		else
			this.body.velocity.x = this.speed/this.diagRatio;
	}
};

Player.prototype.pickAnimation = function()
{
	if(this.body.velocity.x > 0 || (this.body.velocity.x > 0 && this.body.velocity.y > 0)) //SE
	{
		this.facingRight = true;
		
		if(!this.gaunt)
			this.animations.play('rightRun');
		else
			this.animations.play('rightRun_Hurt');
	}
	else if(this.body.velocity.x > 0 && this.body.velocity.y < 0) //NE
	{
		this.facingRight = true;
		
		if(!this.gaunt)
			this.animations.play('rightRun');
		else
			this.animations.play('rightRun_Hurt');
	}
	else if(this.body.velocity.x < 0 || (this.body.velocity.x < 0 && this.body.velocity.y < 0)) //NW
	{
		this.facingRight = false;
		
		if(!this.gaunt)
			this.animations.play('leftRun');
		else
			this.animations.play('leftRun_Hurt');
	}
	else if(this.body.velocity.x < 0 && this.body.velocity.y > 0) //SW
	{
		this.facingRight = false;

		if(!this.gaunt)
			this.animations.play('leftRun');
		else
			this.animations.play('leftRun_Hurt');
	}
	else if(this.body.velocity.y > 0)
	{
		if(!this.gaunt)
			this.animations.play('downRun');
		else
			this.animations.play('downRun_Hurt');
	}
	else if(this.body.velocity.y < 0)
	{
		if(!this.gaunt)
			this.animations.play('upRun');
		else
			this.animations.play('upRun_Hurt');
	}
	else
	{
		if(this.facingRight)
			this.animations.play('rightIdle');
		else
			this.animations.play('leftIdle');
	}

};

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
};

Player.prototype.wobble = function()
{
	var wobbleTimer = game.time.create(true);

	wobbleTimer.add(0, this.wobbleLeft, this);
	wobbleTimer.add(10, this.wobbleLeft, this);
	wobbleTimer.add(20, this.wobbleRight, this);
	wobbleTimer.add(30, this.wobbleRight, this);
	wobbleTimer.add(40, this.wobbleRight, this);
	wobbleTimer.add(50, this.wobbleRight, this);
	wobbleTimer.add(60, this.wobbleLeft, this);
	wobbleTimer.add(70, this.wobbleLeft, this);

	wobbleTimer.start();
}

Player.prototype.wobbleLeft = function()
{
	this.starveBar.cameraOffset.x -= 1;
	this.starveFill.cameraOffset.x -= 1;
};

Player.prototype.wobbleRight = function()
{
	this.starveBar.cameraOffset.x += 1;
	this.starveFill.cameraOffset.x += 1;
};

Player.prototype.dying = function()
{
	var timer = game.time.create(true);
	game.deadText = game.add.text(this.x - 150, this.y - 160, 
			'You died.', textStyle);
	//text.alpha = 0;

	timer.add(2000, function() {
		game.state.start('Dead');
	}, this);

	timer.start();
};

Player.prototype.makeBullet = function() 
{
	var bullet = new Bullet(this.x, this.y, game.input.worldX, game.input.worldY, game);
	game.add.existing(bullet);

	this.shotSound.play('', 0, .25, false);

	this.gaunt = true;
};

function fire(player)
{
	if(game.input.worldX >= player.x)
	{
		player.animations.play('rightShoot');
		player.facingRight = true;
	}
	else
	{
		player.animations.play('leftShoot');
		player.facingRight = false;
	}

	player.shooting = true;
};

function eat(player, corpse)
{
	if(player.gaunt && game.input.keyboard.isDown(Phaser.Keyboard.E))
	{
		corpse.heldTime++;
		corpse.bar.scale.set((corpse.heldTime/60)*16, 1);
		player.eating = true;
		if(corpse.heldTime > 60)
		{
			player.gaunt = false;
			player.speed = 250;
			player.eating = false;
			corpse.bar.destroy();
			corpse.destroy();
		}
	}
	else
	{
		player.eating = false;
		corpse.bar.scale.set(0, 1);
		corpse.heldTime = 0;
	}
}
