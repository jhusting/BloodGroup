function GunGuy(x, y, game)
{
	Enemy.call(this, x + 16, y + 16, game, 'gunGuy');

	//this.scale.set(0.75);

	this.lineDist = 550;

	this.bulletCounter = 5;
	this.shotSound = game.add.audio('shot');

	this.seenFrames = 0;

	this.discovered = true;

	//setup animations
	this.animations.add('idle', Phaser.Animation.generateFrameNames('EnemyIdle', 1, 6, '', 2), 3, true);
	this.animations.add('rightRun', Phaser.Animation.generateFrameNames('EnemyRightRun', 1, 5, '', 2), 3, true);
	this.animations.add('leftRun', Phaser.Animation.generateFrameNames('EnemyLeftRun', 1, 5, '', 2), 3, true);
	this.animations.add('upRun', Phaser.Animation.generateFrameNames('EnemyUpRun', 1, 4, '', 2), 3, true);
	this.animations.add('downRun', Phaser.Animation.generateFrameNames('EnemyDownRun', 2, 4, '', 2), 3, true);

	this.animations.add('rightShoot', Phaser.Animation.generateFrameNames('EnemyRightShoot', 1, 4, '', 2), 8, true);
	this.animations.add('leftShoot', Phaser.Animation.generateFrameNames('EnemyLeftShoot', 1, 4, '', 2), 8, true);
	this.animations.add('upShoot', Phaser.Animation.generateFrameNames('EnemyUpShoot', 1, 2, '', 2), 8, true);
	this.animations.add('downShoot', Phaser.Animation.generateFrameNames('EnemyDownShoot', 1, 2, '', 2), 8, true);

	this.shooting = false; //if the enemy is currently shooting
}

GunGuy.prototype = Object.create(Phaser.Sprite.prototype);
GunGuy.prototype.constructor = GunGuy;

GunGuy.prototype.update = function ()
{
	this.X.x = this.x;
	this.X.y = this.y;

	if(this.discovered)
	{
		//draw a line from the center of this sprite to the player
		this.playerLine = new Phaser.Line(this.x, this.y, player.x, player.y);
		//Convert playerline angle to degrees from radians and normalize to 0-360 instead of 0-180 and 0-(-180)
		this.playerAng = normRad(this.playerLine.angle);

		//checks if playerLine is intersecting a tile
		var intersects = getClosestPoint(this.playerLine, bigRoom.walls, 3);

		//if intersects > 1, the player is behind a wall
		this.playerBehind = (intersects !== null);

		if(this.seen !== null)
		{
			this.seen.x = this.x - 16;
			this.seen.y = this.y - 48;
		}

		if(this.seenX === null && this.path.length > 1) //if the player isn't seen, and hte path exists, move along the path
			moveAlongPath(this);
		else
		{
			//if the player is seen, or has been seen, move towards the spot they were seen at
			if(Phaser.Math.distance(this.x, this.y, this.seenX, this.seenY) > 3)
				game.physics.arcade.moveToXY(this, this.seenX, this.seenY, 60);
			else
			{
				this.seenFrames++;

				this.x = this.seenX;
				this.y = this.seenY;
				this.body.velocity.x = 0;
				this.body.velocity.y = 0;

				if(this.seenFrames === game.time.desiredFps*3) //if the player hasn't been seen for 3 seconds
				{
					this.seenFrames = 0;

					this.seenX = null;
					this.seenY = null;

					generatePath(this, game, bigRoom.walls);
				}
			}
		}


		//less deg is 30 less than the guy's direction, more deg is 30 more
		this.lessDeg = normDeg(this.currMidDeg - 30);
		this.moreDeg = normDeg(this.currMidDeg + 30);

		//calculates the lines
		this.middleLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.currMidDeg), this.lineDist);
		this.lessLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.lessDeg), this.lineDist);
		this.moreLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.moreDeg), this.lineDist);

		//checks if lessline is intersecting with a tile
		if(!lowspec)
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 5);
		else
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 8);
		if(point != null)
		{
			this.lessLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		//check if moreLine is intersecting a tile
		if(!lowspec)
			point = getClosestPoint(this.moreLine, bigRoom.walls, 5);
		else
			point = getClosestPoint(this.moreLine, bigRoom.walls, 8);
		if(point != null)
		{
			this.moreLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		//if the player isn't behind a wall, and is close enough to the enemy
		if( !this.playerBehind && this.playerLine.length < this.lineDist )
		{
			//these check if the player line is contained within moreline and lessline
			if(this.moreDeg < 60 && (this.playerAng > this.lessDeg || this.playerAng < this.moreDeg))
				seenFunction(this);
			else if(this.moreDeg >= 60 && (this.playerAng > this.lessDeg && this.playerAng < this.moreDeg))
				seenFunction(this);
			else if(this.seen !== null)
			{
				this.shooting = false;
				this.seen.destroy();
				this.seen = null;
			}
		}
		else if(this.seen !== null)
		{
			this.shooting = false;
			this.seen.destroy();
			this.seen = null;
		}

		//this calculates the middle line moving towards it's target angle
		if(Phaser.Math.difference(this.currMidDeg, this.middleDeg) < 5 || 
			Phaser.Math.difference(this.currMidDeg, this.middleDeg + 360) < 5)
		{
			this.currMidDeg = this.middleDeg;
		}
		this.currMidDeg += turnTowards(this.currMidDeg, this.middleDeg);
		this.currMidDeg = normDeg(this.currMidDeg);

		//if the player is less than 64 pixels away, and isn't seen, show the X for melee
		if(this.playerLine.length < 64 && this.seen === null)
		{
			Enemy.prototype.melee.call(this);
		}
		else
			this.X.alpha = 0;

		this.pickAnimation();
		this.draw();
		this.bringToTop();
	}
}

//picks the animation for what the enemy is doing right now
GunGuy.prototype.pickAnimation = function()
{
	if(this.body.velocity.x > 0 || (this.body.velocity.x > 0 && this.body.velocity.y > 0)) //SE
	{
		if(!this.shooting)
			this.animations.play('rightRun');
		else
			this.animations.play('rightShoot');
	}
	else if(this.body.velocity.x > 0 && this.body.velocity.y < 0) //NE
	{
		if(!this.shooting)
			this.animations.play('rightRun');
		else
			this.animations.play('rightShoot');
	}
	else if(this.body.velocity.x < 0 || (this.body.velocity.x < 0 && this.body.velocity.y < 0)) //NW
	{
		if(!this.shooting)
			this.animations.play('leftRun');
		else
			this.animations.play('leftShoot');
	}
	else if(this.body.velocity.x < 0 && this.body.velocity.y > 0) //SW
	{
		if(!this.shooting)
			this.animations.play('leftRun');
		else
			this.animations.play('leftShoot');
	}
	else if(this.body.velocity.y > 0)
	{
		if(!this.shooting)
			this.animations.play('downRun');
		else
			this.animations.play('downShoot');
	}
	else if(this.body.velocity.y < 0)
	{
		if(!this.shooting)
			this.animations.play('upRun');
		else
			this.animations.play('upShoot');
	}
	else
	{
		this.animations.play('idle');
	}
};

//draws the lines for this enemies LOS
GunGuy.prototype.draw = function()
{
	this.graphics.clear();
	this.graphics.moveTo(this.lessLine.start.x, this.lessLine.start.y);
	this.graphics.lineStyle(3, 0x000000, .75);	

	this.graphics.lineTo(this.lessLine.end.x, this.lessLine.end.y);

	this.graphics.moveTo(this.moreLine.start.x, this.moreLine.start.y);
	this.graphics.lineTo(this.moreLine.end.x, this.moreLine.end.y);
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

	this.shooting = true;

	if(guy.bulletCounter > (game.time.desiredFps/(60/8)))
	{
		guy.shotSound.play('', 0, .05, false);
		var bull = game.add.sprite(guy.x - 8 + Math.random()*16,
								   guy.y - 8 + Math.random()*16, 'atlas', 'smallBullet');
		bull.anchor.set(0.5, 0.5);
		bull.rotation = guy.playerLine.angle;
		enemyBullets.add(bull);
		game.physics.arcade.enable(bull);
		game.physics.arcade.moveToXY(bull, player.x, player.y, 450);

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

