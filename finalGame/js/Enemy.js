function Enemy(x, y, game, key)
{
	Phaser.Sprite.call(this, game, x, y, 'atlas', key);
	this.anchor.set(0.5, 0.5);
	game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;

	this.lessDeg = -30;
	this.middleDeg = 0;
	this.moreDeg = 30;

	this.currMidDeg = this.middleDeg;

	this.playerAng = 0;

	this.middleLine = new Phaser.Line(x,y, x,y);
	this.lessLine = new Phaser.Line(x,y, x,y);
	this.moreLine = new Phaser.Line(x,y, x,y);
	this.playerLine = new Phaser.Line(x,y, x,y);

	this.lineDist = 100;

	this.graphics = game.add.graphics();

	this.seen = null;
	this.seenX = null;
	this.seenY = null;

	this.X = game.add.sprite(this.x, this.y, 'X');
	this.X.anchor.set(0.5);
	this.X.alpha = 0;

	this.path = [new Phaser.Point(this.x, this.y)];
	this.pathIndex = 0;
	this.pathMover = -1;

	this.playerBehind = false;

	this.discovered = false;
	generatePath(this, game, terrainLayer);
}

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function ()
{
	this.bringToTop();
	if(this.inCamera)
		this.discovered = true;
}