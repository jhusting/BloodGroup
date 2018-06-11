function Player(game, key, x, y)
{
	// call to Phaser.Sprite // new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, 'atlas', key);

	this.anchor.set(0.5);

	//setup player animations
	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 2, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('pl_LeftIdle', 1, 2, '', 2), 2, true);

	this.animations.add('rightIdle_Hurt', Phaser.Animation.generateFrameNames('pl_IdleGauntRight', 1, 2, '', 2), 2, true);
	this.animations.add('leftIdle_Hurt', Phaser.Animation.generateFrameNames('pl_IdleGauntLeft', 1, 2, '', 2), 2, true);

	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('pl_RightRun', 2, 12, '', 2), 22, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('pl_LeftRun', 2, 12, '', 2), 22, true);
	this.animations.add('upRun', Phaser.Animation.generateFrameNames('pl_UpRun', 2, 12, '', 2), 22, true);
	this.animations.add('downRun', Phaser.Animation.generateFrameNames('pl_DownRun', 2, 12, '', 2), 22, true);

	this.animations.add('rightRun_Hurt', Phaser.Animation.generateFrameNames('pl_GauntRight', 2, 12, '', 2), 10, true);
	this.animations.add('leftRun_Hurt', Phaser.Animation.generateFrameNames('pl_GauntLeft', 2, 12, '', 2), 10, true);
	this.animations.add('upRun_Hurt', Phaser.Animation.generateFrameNames('pl_GauntUp', 2, 12, '', 2), 10, true);
	this.animations.add('downRun_Hurt', Phaser.Animation.generateFrameNames('pl_GauntDown', 2, 12, '', 2), 10, true);

	this.animations.add('rightShoot', Phaser.Animation.generateFrameNames('pl_RightShoot', 1, 9, '', 2), 30, false);
	this.animations.add('leftShoot', Phaser.Animation.generateFrameNames('pl_LeftShoot', 1, 9, '', 2), 30, false);
	this.animations.add('downShoot', Phaser.Animation.generateFrameNames('pl_DownShoot', 1, 9, '', 2), 30, false);
	this.animations.add('upShoot', Phaser.Animation.generateFrameNames('pl_UpShoot', 1, 9, '', 2), 30, false);

	this.animations.add('death', Phaser.Animation.generateFrameNames('pl_Death', 1, 6, '', 2), 10, false);
	this.animations.add('death_Hurt', Phaser.Animation.generateFrameNames('pl_GauntDeath', 1, 6, '', 2), 10, false);

	this.animations.play('rightIdle');

	game.physics.arcade.enable(this);

	this.body.collideWorldBounds = true;
	this.body.drag.x = 1200;
	this.body.drag.y = 1200;

	//setup player properties
	this.speed = 200; //speed in one direction
	this.diagRatio = 1.35; //diagonal speed is speed/diagRatio
	this.wasDown = false; //true if the mouse pointer was down last frame
	this.fire = false; //if the player is currently shooting
	//this.z = 100;
	this.canFire = 0; //if the player can fire
	this.shotCounter = 0; //keeps track of how long the player has been firing
	
	this.shotSound = game.add.audio('playerShot');

	//sprite that controls the red fill of the bleeding to death bar
	this.starveFill = game.add.image(0, 0, 'atlas', 'healthBarFill');
	this.starveFill.anchor.set(0.5, 1);
	this.starveFill.alpha = 0; //set it to be initially invisible
	this.starveFill.fixedToCamera = true;
	this.starveFill.cameraOffset = new Phaser.Point(32, 544);
	game.physics.arcade.enable(this.starveFill);

	//sprite that controls the outer edge of the death bar
	this.starveBar = game.add.image(0, 0, 'atlas', 'healthBar1');
	this.starveBar.alpha = 0; //set it to be invisible
	this.starveBar.fixedToCamera = true;
	this.starveBar.cameraOffset = new Phaser.Point(16, 150);
	game.physics.arcade.enable(this.starveBar);

	this.starveScale = 100; //current scale of the starve fill (100 means scale is 1, 50 means scale is .5)
	this.starveCracks = 1;

	//this will emit the after images of the player when they move along blood
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

	//fill of the charging bar when shooting
	this.shootingPart = game.add.sprite(this.x - 20, this.y + 14, 'atlas', 'shootingPart');
	this.shootingPart.anchor.set(0.5, 1);
	this.shootingPart.alpha = 0;

	//outline of the charging bar when shooting
	this.shootingBar = game.add.sprite(this.x - 24, this.y - 16, 'atlas', 'shootingBar');
	this.shootingBar.alpha = 0;

	this.dead = false; //player is currently in death animation
	this.melee = false; //player is currently melee attacking
	this.gaunt = false; //player is losing blood
	this.eating = false; //player is eating a corpse
	this.onBlood = false; //player is on a blood particle
	this.shooting = false; //player is shooting
	this.facingRight = true; //player is facing right
	this.facingUp = false; //player is facing up
	this.tutorial = false; //player is in the tutorial level
}

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function()
{
	/*this.bringToTop();
	this.starveFill.bringToTop();
	this.starveBar.bringToTop();*/

	var onCorpse = game.physics.arcade.overlap(this, corpses, eat, null, this);

	if(!onCorpse)
		this.eating = false;

	if(this.canFire < 5)
		this.canFire++;

	//move the charge bar to the player
	this.shootingPart.x = this.x - 20;
	this.shootingPart.y = this.y + 14;
	this.shootingBar.x = this.x - 24;
	this.shootingBar.y = this.y - 16;

	//if you are on blood and dying, move at 125
	if(this.gaunt && this.onBlood)
	{
		this.speed = 125;
		this.emit();
	}
	else if(this.gaunt) //just dying
		this.speed = 70;
	else if(this.onBlood) //on blood and not dying
	{
		this.speed = 300;
		this.emit();
	}
	else //not on blood, not dying
		this.speed = 200;

	if(this.gaunt) //this set of codoe that handles the bleeding to death bar
	{
		if(this.eating) //if you are eating, move the bar up
		{
			this.starveScale += .2;
			if (this.starveScale > 100)
				this.starveScale = 100;
		}
		else if(this.onBlood) //if you are on blood, move it down slowly
			this.starveScale -= .2;
		else if(!this.eating) //move the bar down
			this.starveScale -= .4;

		if(	(this.starveScale < 80 && this.starveCracks == 1) ||
			(this.starveScale < 60 && this.starveCracks == 2) ||
			(this.starveScale < 40 && this.starveCracks == 3) || 
			(this.starveScale < 20 && this.starveCracks == 4) )
		{	
			//wobbles the bar every 20%
			this.wobble();
			this.starveCracks++;
			
			this.starveBar.frameName = 'healthBar' + this.starveCracks;
		}

		//makes the bar and fill visible
		this.starveBar.alpha = 1;
		this.starveFill.alpha = 1;

		if(this.starveScale <= 0 && !this.dead) //if the bar is empty
		{
			this.starveScale = 0;
			this.dead = true;
			this.dying();
			this.starveBar.frameName = 'healthBar0';
		}

		if(this.starveScale < 50) //this makes the fill flash when the bar is below 50%
		{
			if(this.starveScale%3 < 1.5)
				this.starveFill.alpha = 400;
			else
				this.starveFill.alpha = 1;
		}

		//this handles the cropping of the fill
		var height = 400*(this.starveScale/100);
		if(height < 0)
			height = 0;
		this.starveFill.crop(new Phaser.Rectangle(this.starveFill.worldX - 16, this.starveFill.worldY - height, 32, height));
	}
	else
	{	
		//if you aren't dying reset everything
		this.starveBar.alpha = 0;
		this.starveFill.alpha = 0;
		this.starveScale = 100;
		this.starveCracks = 1;
		this.starveBar.frameName = 'healthBar1';
	}

	if(game.input.mousePointer.isDown) //if the mouse is down and they aren't gaunt and can fire, fire
	{
		if(!this.shooting && !this.gaunt && this.canFire > 4)
			fire(this);
	}

	if(!this.shooting && !this.dead && !this.melee && !game.input.mousePointer.isDown) //if you aren't shooting or dead, process input for the player
		this.processInput();

	if(game.input.mousePointer.isDown && this.shooting) //this handles the shooting animation and charge bar
	{
		this.shotCounter++;

		//make the charge bar visible
		this.shootingBar.alpha = 1;
		this.shootingPart.alpha = 1;

		//change the scale of the bar
		var scale = this.shotCounter/(game.time.desiredFps/3);
		if(scale > 1)
			scale = 1;
		this.shootingPart.scale.set(1, scale);

		//if the shot counter has reached fps/3 make the bullet
		if(this.shotCounter == (game.time.desiredFps/3))
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
	}

	if(!this.shooting && !this.dead)
		this.pickAnimation();
};

Player.prototype.processInput = function ()
{
	if(game.input.keyboard.isDown(Phaser.Keyboard.W)) //move up
	{
		if(Math.abs(this.body.velocity.x) == 0)
			this.body.velocity.y = -this.speed;
		else 
			this.body.velocity.y = -this.speed/this.diagRatio; //if moving sideways, move up more slowly
	}
		
	if(game.input.keyboard.isDown(Phaser.Keyboard.S)) //move down
	{
		if(Math.abs(this.body.velocity.x) == 0)
			this.body.velocity.y = this.speed;
		else
			this.body.velocity.y = this.speed/this.diagRatio;
	}
	
	if(game.input.keyboard.isDown(Phaser.Keyboard.A)) //move left
	{
		if(Math.abs(this.body.velocity.y) == 0)
			this.body.velocity.x = -this.speed;
		else
			this.body.velocity.x = -this.speed/this.diagRatio;
	}
		
	if(game.input.keyboard.isDown(Phaser.Keyboard.D)) //move right
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
		{
			if(!this.gaunt)
				this.animations.play('rightIdle');
			else
				this.animations.play('rightIdle_Hurt');
		}
		else
		{
			if(!this.gaunt)
				this.animations.play('leftIdle');
			else
				this.animations.play('leftIdle_Hurt');
		}
	}

};

//emits an afterimage of the player
Player.prototype.emit = function()
{
	if(this.emitterCounter > (game.time.desiredFps/(60/7)))
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

//sets up a timer to wobble the bleeding to death bar
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

//sets up the death timer that moves the player to the dead state
Player.prototype.dying = function()
{
	if(this.gaunt)
			this.animations.play('death_Hurt');
		else
			this.animations.play('death');

	var timer = game.time.create(true);

	timer.add(2000, function() {
		if(!this.tutorial)
			game.state.start('Dead');
		else
			game.state.start('Tutorial');
	}, this);

	timer.start();
};

//makes a bullet
Player.prototype.makeBullet = function() 
{
	var bullet = new Bullet(this.x, this.y, game.input.worldX, game.input.worldY, game);
	game.add.existing(bullet);

	this.shotSound.play('', 0, .25, false);

	this.gaunt = true;
};

//sets shooting to true, starts the player on the shooting animation
function fire(player)
{
	var line = new Phaser.Line(player.x, player.y, game.input.worldX, game.input.worldY);
	var ang = normRad(line.angle);

	if(ang >= 325 || ang <= 45)
	{
		player.animations.play('rightShoot');
		player.facingRight = true;
	}
	else if(ang > 45 && ang < 135)
	{
		player.animations.play('downShoot');
		player.facingRight = true;
	}
	else if(ang >= 135 && ang <= 225)
	{
		player.animations.play('leftShoot');
		player.facingRight = false;
	}
	else 
	{
		player.animations.play('upShoot');
		player.facingRight = true;
	}

	player.shooting = true;
};

//handles the player eating a corpse
function eat(player, corpse)
{
	if(player.gaunt && game.input.keyboard.isDown(Phaser.Keyboard.E))
	{
		corpse.heldTime++;
		corpse.bar.scale.set((corpse.heldTime/60)*16, 1);
		player.eating = true;
		if(corpse.heldTime > game.time.desiredFps)
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
