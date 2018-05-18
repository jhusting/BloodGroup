function GunGuy(x, y, game)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', 'gunGuy');

	this.anchor.set(0.5, 0.5);
	this.scale.set(0.75);

	game.physics.arcade.enable(this);
	this.body.collideWorldbounds = true;

	this.path = [ new Phaser.Point(this.x, this.y) ];

	this.lessDeg = -30;
	this.middleDeg = 0;
	this.moreDeg = 30;

	this.currMidDeg = this.middleDeg;

	this.playerAng = 0;

	this.middleLine = new Phaser.Line(x,y, x,y);
	this.lessLine = new Phaser.Line(x,y, x,y);
	this.moreLine = new Phaser.Line(x,y, x,y);
	this.playerLine = new Phaser.Line(x,y, x,y);

	this.lineDist = 225;

	this.graphics = game.add.graphics();

	this.seen = null;
	this.seenX = null;
	this.seenY = null;

	this.pathIndex = 0;
	this.pathMover = -1;

	this.bulletCounter = 5;
	this.playerBehind = false;
	this.shotSound = game.add.audio('shot');

	this.X = game.add.sprite(this.x, this.y, 'X');
	this.X.anchor.set(0.5);
	this.X.alpha = 0;

	this.discovered = false;
	generatePath(this, game, terrainLayer);
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

		var intersects = terrainLayer.getRayCastTiles(this.playerLine, 3, true);

		this.playerBehind = (intersects.length > 0);

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

		var point = getClosestPoint(this.lessLine, terrainLayer, 5);
		if(point != null)
		{
			this.lessLine = new Phaser.Line(this.x, this.y, point.x, point.y);
		}

		point = getClosestPoint(this.moreLine, terrainLayer, 5);
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

		if(this.playerLine.length < 80 && this.seen === null)
		{
			this.X.alpha = 1;

			if(game.input.keyboard.isDown(Phaser.Keyboard.Q))
			{
				var corpse = new Corpse(game, 1, 0, this.x, this.y);
				game.add.existing(corpse);
				this.graphics.destroy();
				this.X.destroy();
				this.destroy();
			}
		}
		else
			this.X.alpha = 0;
	}
}

function getClosestPoint(line, layer, step)
{
	var coords = line.coordinatesOnLine(step);

	for(var i = 0; i < coords.length; i++)
	{
		var coord = coords[i];
		var tiles = layer.getTiles(coord[0], coord[1], 1, 1, true, false);

		if (tiles.length > 0)
			return new Phaser.Point(coord[0], coord[1]);
	}

	return null;
}

function normDeg(angle)
{
	if(angle < 0)
		return angle + 360;
	else if(angle > 360)
		return angle - 360;

	return angle;
}

function normRad(angle)
{
	return Phaser.Math.radToDeg(Phaser.Math.normalizeAngle(angle));
}


function turnTowards(angle1, angle2)
{
	var diff = angle2 - angle1;

	if(diff <= 1 && diff >= 0)
		return 0;
	else if(diff < 180 && diff > 0)
		return 2;
	else if(diff < -180 && diff > -360)
		return 2;
	else return -2;
}

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
		game.physics.arcade.enable(bull);
		game.physics.arcade.moveToXY(bull, player.x, player.y, 700);
		guy.bulletCounter = -1;
	}
	guy.bulletCounter++;
}

function generatePath(guy, game, layer)
{
	var lastlastX = guy.x, lastlastY = guy.y;
	var lastX = guy.x, lastY = guy.y;
	var testX = guy.x, testY = guy.y;
	var randomArr;
	var numPoints = 3 + Math.random()*2;
	var grid = 64;
	//console.log('numPoints: ' + numPoints);

	for(var i = 0; i < numPoints; i++)
	{
		randomArr = [1, 2, 3, 4];
		var occupied = true;
		for(var j = 0; occupied && j < 4; j++)
		{
			testX = lastX;
			testY = lastY;
			var direction = Phaser.ArrayUtils.removeRandomItem(randomArr);
			occupied = false;

			if(direction == 1)
				testX += grid;
			else if(direction == 2)
				testY += grid;
			else if(direction == 3)
				testX -= grid;
			else
				testY -= grid;

			var intersects = layer.getTiles(testX-16, testY-16, 32, 32, true);

			/*console.log('lastX: ' + lastX +
						'\nlastY: ' + lastY +
						'\ntestX: ' + testX + 
						'\ntestY: ' + testY + 
						'\nlastlastX: ' + lastlastX + 
						'\nlastlastY: ' + lastlastY);*/
			if(intersects.length > 0)
				occupied = true;
			if(testX == lastlastX && testY == lastlastY)
				occupied = true;
		}

		if(!occupied)
		{
			guy.path.push(new Phaser.Point(testX, testY));
			lastX = testX;
			lastY = testY;

			//console.log('push: ' + testX + ', ' + testY);
			lastlastX = guy.path[guy.path.length - 2].x;
			lastlastY = guy.path[guy.path.length - 2].y;
		}
		else
			break;
	}

	//console.log(guy.path);
}

function checkWall(wall, occupied, testX, testY)
{
	if(Phaser.Rectangle.contains(wall.getBounds(), testX, testY))
		occupied.value = true;
}

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