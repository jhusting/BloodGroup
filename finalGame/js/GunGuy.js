function GunGuy(x, y, game)
{
	Enemy.call(this, x + 16, y + 16, game, 'gunGuy');

	//this.scale.set(0.75);

	this.lineDist = 550;

	this.bulletCounter = 5;
	this.shotSound = game.add.audio('shot');

	this.seenFrames = 0;

	this.animations.add('idle', Phaser.Animation.generateFrameNames('EnemyIdle', 1, 2, '', 2), 3, true);
	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('EnemyRightRun', 1, 3, '', 2), 5, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('EnemyLeftRun', 1, 6, '', 2), 8, true);
	this.animations.add('upRun', Phaser.Animation.generateFrameNames('EnemyUpRun', 1, 6, '', 2), 5, true);
	this.animations.add('downRun', Phaser.Animation.generateFrameNames('EnemyDownRun', 1, 6, '', 2), 5, true);
}

GunGuy.prototype = Object.create(Phaser.Sprite.prototype);
GunGuy.prototype.constructor = GunGuy;

GunGuy.prototype.update = function ()
{
	this.bringToTop();
	if(this.inCamera)
		this.discovered = true;

	this.X.x = this.x;
	this.X.y = this.y;
	//console.log(this.exists);
	if(lowspec && !this.inCamera)
	{
		this.body.velocity.x = 0;
		this.body.velocity.y = 0;
	}
	else if(this.discovered)
	{
		//draw a line from the center of this sprite to the player
		this.playerLine = new Phaser.Line(this.x, this.y, player.x, player.y);
		//Convert playerline angle to degrees from radians and normalize to 0-360 instead of 0-180 and 0-(-180)
		this.playerAng = normRad(this.playerLine.angle);

		var intersects = getClosestPoint(this.playerLine, bigRoom.walls, 3);

		this.playerBehind = (intersects !== null);

		if(this.seen !== null)
		{
			this.seen.x = this.x - 16;
			this.seen.y = this.y - 48;
		}

		if(this.seenX === null && this.path.length > 1)
			moveAlongPath(this);
		else
		{
			if(Phaser.Math.distance(this.x, this.y, this.seenX, this.seenY) > 3)
				game.physics.arcade.moveToXY(this, this.seenX, this.seenY, 60);
			else
			{
				this.seenFrames++;

				this.x = this.seenX;
				this.y = this.seenY;
				this.body.velocity.x = 0;
				this.body.velocity.y = 0;

				if(this.seenFrames === 180)
				{
					this.seenFrames = 0;
					//this.seen.destroy();
					//this.seen = null;

					this.seenX = null;
					this.seenY = null;

					generatePath(this, game, bigRoom.walls);
				}
			}
		}


		//less deg is 30 less than the guy's direction, more deg is 30 more
		this.lessDeg = normDeg(this.currMidDeg - 30);
		this.moreDeg = normDeg(this.currMidDeg + 30);

		this.middleLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.currMidDeg), this.lineDist);
		this.lessLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.lessDeg), this.lineDist);
		this.moreLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.moreDeg), this.lineDist);

		if(!lowspec)
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 5);
		else
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 8);
		if(point != null)
		{
			this.lessLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		if(!lowspec)
			point = getClosestPoint(this.moreLine, bigRoom.walls, 5);
		else
			point = getClosestPoint(this.moreLine, bigRoom.walls, 8);

		if(point != null)
		{
			this.moreLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		if( !this.playerBehind && this.playerLine.length < this.lineDist )
		{
			if(this.moreDeg < 60 && (this.playerAng > this.lessDeg || this.playerAng < this.moreDeg))
				seenFunction(this);
			if(this.moreDeg >= 60 && (this.playerAng > this.lessDeg && this.playerAng < this.moreDeg))
				seenFunction(this);
			else if(this.seen !== null)
			{
				this.seen.destroy();
				this.seen = null;
			}
		}
		else if(this.seen !== null)
		{
			this.seen.destroy();
			this.seen = null;
		}

		if(Phaser.Math.difference(this.currMidDeg, this.middleDeg) < 5 || 
			Phaser.Math.difference(this.currMidDeg, this.middleDeg + 360) < 5)
		{
			this.currMidDeg = this.middleDeg;
		}
		this.currMidDeg += turnTowards(this.currMidDeg, this.middleDeg);
		this.currMidDeg = normDeg(this.currMidDeg);

		if(this.playerLine.length < 64 && this.seen === null)
		{
			this.X.alpha = 1;

			if(!this.dead && game.input.keyboard.isDown(Phaser.Keyboard.F))
			{
				var timer = game.time.create(true);			

				timer.add(100, function() {
					var puddle;
					if(Math.random()*100 < 50)
						puddle = game.add.sprite(this.x, this.y, 'atlas', 'puddle1');
					else
						puddle = game.add.sprite(this.x, this.y, 'atlas', 'puddle2');

					puddle.anchor.set(0.5, 0.5);
					game.physics.arcade.enable(puddle);
					bloods.add(puddle);

					var corpse = new Corpse(game, 1, 0, this.x, this.y);
					game.add.existing(corpse);
					corpses.add(corpse);

					this.graphics.destroy();
					this.X.destroy();
					this.destroy();
				}, this);
				
				timer.start();
				this.dead = true;
			}
		}
		else
			this.X.alpha = 0;

		this.pickAnimation();
	}
}

GunGuy.prototype.pickAnimation = function()
{
	if(this.body.velocity.x > 0 || (this.body.velocity.x > 0 && this.body.velocity.y > 0)) //SE
	{
		this.animations.play('rightRun');
	}
	else if(this.body.velocity.x > 0 && this.body.velocity.y < 0) //NE
	{
		this.animations.play('rightRun');
	}
	else if(this.body.velocity.x < 0 || (this.body.velocity.x < 0 && this.body.velocity.y < 0)) //NW
	{
		this.animations.play('leftRun');
	}
	else if(this.body.velocity.x < 0 && this.body.velocity.y > 0) //SW
	{
		this.animations.play('leftRun');
	}
	else if(this.body.velocity.y > 0)
	{
		this.animations.play('downRun');
	}
	else if(this.body.velocity.y < 0)
	{
		this.animations.play('upRun');
	}
	else
	{
		this.animations.play('idle');
	}
};

/*
	seenFunction
	Handles what happens when a gunGuy sees a player
*/
function seenFunction(guy)
{
	if(guy.seen == null)
			guy.seen = game.add.image(guy.x - 16, guy.y - 48, 'atlas', 'seen');

	guy.seenX = player.x;
	guy.seenY = player.y;
	guy.middleDeg = guy.playerAng;

	if(guy.bulletCounter > (game.time.desiredFps/(60/4)))
	{
		guy.shotSound.play('', 0, .05, false);
		var bull = game.add.sprite(guy.x - 8 + Math.random()*16,
								   guy.y - 8 + Math.random()*16, 'atlas', 'smallBullet');
		enemyBullets.add(bull);
		game.physics.arcade.enable(bull);
		game.physics.arcade.moveToXY(bull, player.x, player.y, 500);
		guy.bulletCounter = -1;
	}
	guy.bulletCounter++;
}

/*
	moveAlongPath
	Moves the gunguy along his little path, changing the middleDeg to the 
	direction it is travelling in
*/
function moveAlongPath(guy)
{
	//If moving right his direction is 0
	if(guy.body.velocity.x > 10)
	{
		guy.middleDeg = 0;
	}
	else if(guy.body.velocity.x < -10) //left direction is 180, etc
	{
		guy.middleDeg = 180;
	}
	else if(guy.body.velocity.y > 10)
	{
		guy.middleDeg = 90;
	}
	else if(guy.body.velocity.y < -10)
	{
		guy.middleDeg = 270;
	}

	if ( 	((guy.pathIndex >= (guy.path.length - 1)) && guy.pathMover > 0 ) || 
			(guy.pathIndex <= 0 && guy.pathMover < 0) )
		guy.pathMover = -guy.pathMover;

	if( Phaser.Math.distance(guy.x, guy.y, 
		guy.path[guy.pathIndex].x, guy.path[guy.pathIndex].y) < 5)
		guy.pathIndex += guy.pathMover;
	else
		moveToXY(guy, guy.path[guy.pathIndex].x, guy.path[guy.pathIndex].y, 15);
}

/*
	moveToXY
	A modified move to XY function that forces the object to only move in 4 directions
	Useful for when moving along a path
*/
function moveToXY(guy, x, y, speed)
{
	if(x - guy.x < 2 && x - guy.x > -2)
	{
		guy.x = x;
		guy.body.velocity.x = 0;
	}
	else if(x - guy.x > 2)
		guy.body.velocity.x = speed;
	else if(x - guy.x < -2)
		guy.body.velocity.x = -speed;
	
	if(y - guy.y < 2 && y - guy.y > -2)
	{
		guy.y = y;
		guy.body.velocity.y = 0;
	}
	else if(y - guy.y > 1)
		guy.body.velocity.y = speed;
	else if(y - guy.y < -1)
		guy.body.velocity.y = -speed;
}