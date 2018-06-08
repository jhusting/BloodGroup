function Turret(x, y, game)
{
	Enemy.call(this, x + 16, y + 16, game, 'player');

	this.lineDist = 1000;
	this.shotSound = game.add.audio('turretShot');
	this.discovered = true;

	this.turnCounter = 0;
	this.turnLine = null;
	//this.turnDeg = null;

	this.lazerLine = null;
	this.shooting = false;
	this.thiccness = 2;
	this.deadly = false;
	this.pickDirection(bigRoom.walls);

	this.animations.add('rightIdle', Phaser.Animation.generateFrameNames('TurretRightIdle', 1, 2, '', 2), 3, true);
	this.animations.add('leftIdle', Phaser.Animation.generateFrameNames('TurretLeftIdle', 1, 2, '', 2), 3, true);
	this.animations.add('upIdle', Phaser.Animation.generateFrameNames('TurretUpIdle', 1, 2, '', 2), 3, true);
	this.animations.add('downIdle', Phaser.Animation.generateFrameNames('TurretDownIdle', 1, 2, '', 2), 3, true);

	this.animations.add('rightShoot', Phaser.Animation.generateFrameNames('TurretRightShoot', 1, 7, '', 2), 20, false);
	this.animations.add('leftShoot', Phaser.Animation.generateFrameNames('TurretLeftShoot', 1, 7, '', 2), 20, false);
	this.animations.add('upShoot', Phaser.Animation.generateFrameNames('TurretUpShoot', 1, 7, '', 2), 20, false);
	this.animations.add('downShoot', Phaser.Animation.generateFrameNames('TurretDownShoot', 1, 7, '', 2), 20, false);
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);
Turret.prototype.constructor = Turret;

Turret.prototype.update = function()
{
	this.X.x = this.x;
	this.X.y = this.y;

	if(this.discovered)
	{
		//draw a line from the center of this sprite to the player
		this.playerLine = new Phaser.Line(this.x, this.y, player.x, player.y);
		//Convert playerline angle to degrees from radians and normalize to 0-360 instead of 0-180 and 0-(-180)
		this.playerAng = normRad(this.playerLine.angle);

		var intersects = getClosestPoint(this.playerLine, bigRoom.walls, 3);

		this.playerBehind = (intersects !== null);

		if(this.turnCounter >= game.time.desiredFps * 4)
		{
			this.turnCounter = 0;
			this.pickDirection(bigRoom.walls);
		}
		this.turnCounter++;

		if(this.seen !== null)
		{
			this.seen.x = this.x - 16;
			this.seen.y = this.y - 48;
		}

		this.middleLine.fromAngle(this.x, this.y, Phaser.Math.degToRad(this.middleDeg), this.lineDist);
		
		if(this.middleDeg == 0)
		{
			this.lessLine = new Phaser.Line(this.x + 16, this.y - 14, this.x + 1000, this.y - 14);
			this.moreLine = new Phaser.Line(this.x + 16, this.y + 14, this.x + 1000, this.y + 14);
		}
		else if(this.middleDeg == 180)
		{
			this.lessLine = new Phaser.Line(this.x - 16, this.y + 14, this.x - 1000, this.y + 14);
			this.moreLine = new Phaser.Line(this.x - 16, this.y - 14, this.x - 1000, this.y - 14);
		}
		else if(this.middleDeg == 90)
		{
			this.lessLine = new Phaser.Line(this.x + 14, this.y + 16, this.x + 14, this.y + 1000);
			this.moreLine = new Phaser.Line(this.x - 14, this.y + 16, this.x - 14, this.y + 1000);
		}
		else if(this.middleDeg == 270)
		{
			this.lessLine = new Phaser.Line(this.x - 14, this.y - 16, this.x - 14, this.y - 1000);
			this.moreLine = new Phaser.Line(this.x + 14, this.y - 16, this.x + 14, this.y - 1000);
		}

		if(!lowspec)
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 5);
		else
			var point = getClosestPoint(this.lessLine, bigRoom.walls, 8);
		if(point != null)
		{
			this.lessLine = new Phaser.Line(this.lessLine.start.x, this.lessLine.start.y, point.x, point.y);
		}

		if(!lowspec)
			point = getClosestPoint(this.moreLine, bigRoom.walls, 5);
		else
			point = getClosestPoint(this.moreLine, bigRoom.walls, 8);

		if(point != null)
		{
			this.moreLine = new Phaser.Line(this.moreLine.start.x, this.moreLine.start.y, point.x, point.y);
		}

		if(this.turnLine !== null)
		{
			if(!lowspec)
				point = getClosestPoint(this.turnLine, bigRoom.walls, 5);
			else
				point = getClosestPoint(this.turnLine, bigRoom.walls, 8);

			if(point != null)
			{
				this.turnLine = new Phaser.Line(this.turnLine.start.x, this.turnLine.start.y, point.x, point.y);
			}
		}

		if( !this.playerBehind && this.playerLine.length < this.lineDist )
		{
			if(	this.middleDeg == 0 && 
				player.x > this.x && player.y >= this.y - 16 &&
				player.y <= this.y + 16)
			{
				this.seenFunction();
			}
			else if(this.middleDeg == 180 && 
					player.x < this.x && player.y >= this.y - 16 &&
					player.y <= this.y + 16)
			{
				this.seenFunction();
			}
			else if(this.middleDeg == 90 && 
					player.y > this.y && player.x >= this.x - 16 &&
					player.x <= this.x + 16)
			{
				this.seenFunction();
			}
			else if(this.middleDeg == 270 && 
					player.y < this.y && player.x >= this.x - 16 &&
					player.x <= this.x + 16)
			{
				this.seenFunction();
			}
			else if(this.seen !== null)
			{
				//this.shooting = false;
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

		if(this.playerLine.length < 64 && this.seen === null)
		{
			Enemy.prototype.melee.call(this);
		}
		else
			this.X.alpha = 0;

		if(!this.shooting)
			this.pickAnimation();
		this.draw();
		this.bringToTop();
	}
};

Turret.prototype.pickAnimation = function()
{
	if(this.middleDeg == 0)
	{
		this.animations.play('rightIdle');
	}
	else if(this.middleDeg == 90)
	{
		this.animations.play('downIdle');
	}
	else if(this.middleDeg == 180)
	{
		this.animations.play('leftIdle');
	}
	else if(this.middleDeg == 270)
	{
		this.animations.play('upIdle');
	}
};

Turret.prototype.seenFunction = function()
{
	if(this.seen == null)
		this.seen = game.add.image(this.x - 16, this.y - 48, 'atlas', 'seen');

	this.seenX = player.x;
	this.seenY = player.y;

	if(!this.shooting && !player.dead)
	{
		this.shooting = true;
		var timer = game.time.create(true);

		if(this.middleDeg == 0)
		{
			this.lazerLine = new Phaser.Line(this.x + 14, this.y - 7, this.x + 1000, this.y - 7);
			this.animations.play('rightShoot');
		}
		else if(this.middleDeg == 90)
		{
			this.lazerLine = new Phaser.Line(this.x, this.y + 6, this.x, this.y + 1000);	
			this.animations.play('downShoot');
		}
		else if(this.middleDeg == 180)
		{
			this.lazerLine = new Phaser.Line(this.x - 14, this.y - 8, this.x - 1000, this.y - 7);	
			this.animations.play('leftShoot');
		}
		else if(this.middleDeg == 270)
		{
			this.lazerLine = new Phaser.Line(this.x, this.y - 16, this.x, this.y - 1000);	
			this.animations.play('upShoot');
		}

		timer.add(200, function() {
			this.thiccness = 1;
		}, this);
		timer.add(220, function() {
			this.thiccness = 2;
		}, this);
		timer.add(240, function() {
			this.thiccness = 4;
			this.deadly = true;
		}, this);
		timer.add(260, function() {
			this.thiccness = 8;
		}, this);
		timer.add((7/20)*1000, function() {
			this.shooting = false;
		}, this);
		timer.add(800, function() {
			this.lazerLine = null;
			this.thiccness = 1;
			//this.shooting = false;
			this.deadly = false;
		}, this);

		timer.start();
	}
	else if(this.deadly)
	{
		if(!player.dead)
		{
			player.dying();
		}

		player.dead = true;
	}
};

Turret.prototype.draw = function()
{
	this.graphics.clear();
	this.graphics.moveTo(this.lessLine.start.x, this.lessLine.start.y);
	this.graphics.lineStyle(3, 0x000000, .75);	

	this.graphics.lineTo(this.lessLine.end.x, this.lessLine.end.y);

	this.graphics.moveTo(this.moreLine.start.x, this.moreLine.start.y);
	this.graphics.lineTo(this.moreLine.end.x, this.moreLine.end.y);

	if(this.turnLine !== null)
	{
		this.graphics.lineStyle(2, 0x3a80f2, .75);
		this.graphics.moveTo(this.turnLine.start.x, this.turnLine.start.y);
		this.graphics.lineTo(this.turnLine.end.x, this.turnLine.end.y);
	}

	if(this.lazerLine !== null)
	{
		this.graphics.lineStyle(this.thiccness, 0xff0000, 1);
		this.graphics.moveTo(this.lazerLine.start.x, this.lazerLine.start.y);
		this.graphics.lineTo(this.lazerLine.end.x, this.lazerLine.end.y);
	}
};

Turret.prototype.pickDirection = function(layer)
{
	var testX = this.x;
	var testY = this.y;
	var testD = 0;
	var grid = 32;
	var randomArr = [1, 2, 3, 4];
	for(var i = 0; i < 4; i++)
	{
		var direction = Phaser.ArrayUtils.removeRandomItem(randomArr);
		testX = this.x;
		testY = this.y;
		if(direction == 1)
		{
			testX += grid;
			testD = 0;
		}
		else if(direction == 2)
		{
			testY += grid;
			testD = 90;
		}
		else if(direction == 3)
		{
			testX -= grid;
			testD = 180;
		}
		else
		{
			testY -= grid;
			testD = 270;
		}

		var intersects = layer.getTiles(testX-16, testY-16, 30, 30, true);

		if(intersects.length == 0 && this.middleDeg != testD)
		{
			var timer = game.time.create(true);	

			if(direction == 1)
				this.turnLine = new Phaser.Line(this.x, this.y, this.x + 1000, this.y);	
			else if(direction == 2)
				this.turnLine = new Phaser.Line(this.x, this.y, this.x, this.y + 1000);	
			else if(direction == 3)
				this.turnLine = new Phaser.Line(this.x, this.y, this.x - 1000, this.y);	
			else if(direction == 4)
				this.turnLine = new Phaser.Line(this.x, this.y, this.x, this.y - 1000);	

			timer.add(1500, function() {
				this.turnLine = null;
				this.middleDeg = testD;
			}, this);
			timer.start();
			return;
		}
	}
};