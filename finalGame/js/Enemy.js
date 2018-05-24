function Enemy(x, y, game, key)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', key);
	this.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;

	//These angles control the enemies' line of sight
	//lessDeg < middleDeg < moreDeg
	//these are "target" angles, the angle the sprite is currently looking it isn't always set to these
	this.lessDeg = -30;
	this.middleDeg = 0;
	this.moreDeg = 30;

	//this controls where the sprite is currently looking
	//it is always decreasing or increasing in order to reach the "target" angle of middleDeg
	this.currMidDeg = this.middleDeg;

	//the angle of the player line
	this.playerAng = 0;

	//lines made from these angles, set a one pixel line on creation
	this.middleLine = new Phaser.Line(x,y, x,y);
	this.lessLine = new Phaser.Line(x,y, x,y);
	this.moreLine = new Phaser.Line(x,y, x,y);
	this.playerLine = new Phaser.Line(x,y, x,y);

	//this is the sprite's seeing distance, it starts at 100 pixels from the center but can be changed
	//gunGuy's seeing distance is 225 pixels from it's center
	this.lineDist = 100;

	//this controls what lines are drawn
	this.graphics = game.add.graphics();

	//this will be a sprite object, along with it's X and Y coordinates
	//the X and Y coordinates also double as the "last seen coordinates" if the player isn't currently seen
	this.seen = null;
	this.seenX = null;
	this.seenY = null;

	//this will be a sprite object that indicates whether or not you can melee attack the enemy
	this.X = game.add.sprite(this.x, this.y, 'X');
	this.X.anchor.set(0.5);
	this.X.alpha = 0;

	//this is the path the enemy will follow
	this.path = [new Phaser.Point(this.x, this.y)];
	//the index of the point the enemy is currently moving to
	this.pathIndex = 0;
	//whether the enemy is incrementing, or decrementing through the path (alternates so you can loop)
	this.pathMover = -1;

	//whether or not the player is behind a wall
	this.playerBehind = false;

	//whether or not the enemy has been on screen at least once
	this.discovered = false;

	this.dead = false;

	//generates the path
	//generatePath(this, game, bigRoom.walls);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function ()
{
}

/*
	getClosestPoint
	Checks along a line whether or not that line intesects a tile, returning the first
	intersection point.
	params: line - a Phaser.Line object giving the line you want to check
	layer - a Phaser.tilemapLayer object giving the tile layer you want to check
	step - an integer; the step size (the distance you step along the line)

	return: a new Phaser.Point containing the first point along to line to contain a tile,
	or null if no such point exists
*/
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

/*
	normDeg
	Normalizes a given degree to the range 0-360

	param: angle - an integer, the degree you wish to normalize
*/
function normDeg(angle)
{
	if(angle < 0)
		return angle + 360;
	else if(angle > 360)
		return angle - 360;

	return angle;
}

/*
	normRad
	Normalizes a given radian to the range 0-360

	param: angle - a float, the radian you wish to normalize
*/
function normRad(angle)
{
	return Phaser.Math.radToDeg(Phaser.Math.normalizeAngle(angle));
}

/*
	turnTowards
	Given two angles, angle1, and angle2, find the optimal direction for angle1 to travel
	to get to angle2

	params: angle1 - your starting angle, 0-360
	angle2 - your target angle, 0-360

	return: an integer, telling you which direction to move
	usage: angle1 += turnTowards(angle1, angle2)
*/
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

/*
	generatePath
	Generate a random path for an enemy object, randomly picking a direction and 
	testing if that location has a tile. Repeatedly does this, eventually ending up
	with a random path

	params: guy - an Enemy that you want to give a new path
	game - Phaser.game instance of the current game
	layer - tileMapLayer object containing the collision tile layer you dont want to path over

	Note: guy.path WILL be updated
*/
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