function GunGuy(x, y, game)
{
	Enemy.call(this, x + 16, y + 16, game, 'gunGuy');

	this.scale.set(0.75);

	this.lineDist = 550;

	this.bulletCounter = 5;
	this.shotSound = game.add.audio('shot');

	//generatePath(this, game, bigRoom.walls);
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
	if(this.discovered)
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
				this.x = this.seenX;
				this.y = this.seenY;
				this.body.velocity.x = 0;
				this.body.velocity.y = 0;
			}
		}


		//less deg is 30 less than the guy's direction, more deg is 30 more
		this.lessDeg = normDeg(this.currMidDeg - 30);
		this.moreDeg = normDeg(this.currMidDeg + 30);

		this.middleLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.currMidDeg), this.lineDist);
		this.lessLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.lessDeg), this.lineDist);
		this.moreLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.moreDeg), this.lineDist);

		var point = getClosestPoint(this.lessLine, bigRoom.walls, 5);
		if(point != null)
		{
			this.lessLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		point = getClosestPoint(this.moreLine, bigRoom.walls, 5);
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

			if(!this.dead && game.input.keyboard.isDown(Phaser.Keyboard.Q))
			{
				var timer = game.time.create(true);			

				timer.add(300, function() {
					timer.start();
					var corpse = new Corpse(game, 1, 0, this.x, this.y);
					game.add.existing(corpse);
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
	}
}

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

	if(guy.bulletCounter > 4)
	{
		guy.shotSound.play('', 0, .1, false);
		var bull = game.add.sprite(guy.x - 8 + Math.random()*16,
								   guy.y - 8 + Math.random()*16, 'atlas', 'smallBullet');
		enemyBullets.add(bull);
		game.physics.arcade.enable(bull);
		game.physics.arcade.moveToXY(bull, player.x, player.y, 700);
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