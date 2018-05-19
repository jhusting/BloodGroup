//Final Proto by Josh Husting
//CMPM 120
//
//Music: "awesome background melody music" by deleted_user_6988258
//https://freesound.org/people/deleted_user_6988258/sounds/399821/
//Gunshot Sound: "Gun Shot.wav" by Bird_man
//https://freesound.org/people/Bird_man/sounds/275151/

// define global game container object
var Final = { };

//new boot goofin
Final.Boot = function() { var cursors, wasDown; };
Final.Boot.prototype = 
{
	init: function() 
	{
		console.log('Boot: init');
	},
	
	preload: function()
	{
		console.log('Boot: preload');
		this.load.path = './assets/img/'; //set initial load path
		this.load.atlas('atlas', 'spritesheet.png', 'sprites.json');
		this.load.image('back', 'back.png');
		this.load.image('pBlood', 'pBlood.png');
		//this.load.image('smallBullet', 'smallBullet.png');
		this.load.image('BGTile', 'BGTile.png');
		this.load.image('X', 'X.png');
		this.load.audio('music', '../audio/music.mp3');
		this.load.audio('shot', '../audio/shot.wav');
		this.load.tilemap('level', '../tiles/Online/online1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('datGoodSheet', '../tiles/Online/Itch_32.png', 32, 32);
	},
	create: function()
	{
		var startMusic = this.add.audio('music');
		//startMusic.play('', 0, .25, true);
		this.add.text(25, 180, 'WASD to Move.\nLeft Click to shoot.' +
							'\nE to feed on a corpse and regain ammo.' + 
							'\nSpace to start!', {fontSize: '24px', fill: '#ffffff'});
		cursors = game.input.keyboard.createCursorKeys();
	}, 
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Play');
		}
	}
};


Final.Play = function()
{
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, terrainLayer, decorationLayer, enemyBullets;
};
Final.Play.prototype =
{
	preload: function()
	{
		console.log('Play: preload');
	},
	create: function()
	{
		console.log('Play: create');
		game.physics.startSystem(Phaser.Physics.ARCADE);
		this.world.setBounds(0, 0, 1586, 1088);
		this.add.image(0, 0, 'back');
		// Create a bitmap texture for drawing lines
    	this.bitmap = this.game.add.bitmapData(this.world.width, this.world.height);
    	this.bitmap.context.fillStyle = 'rgb(255, 255, 255)';
    	this.bitmap.context.strokeStyle = 'rgb(255, 255, 255)';
   	 	this.game.add.image(0, 0, this.bitmap);

		walls = game.add.group();
		walls.enableBody = true;

   	 	map = game.add.tilemap('level');
   	 	map.addTilesetImage('onlineSet', 'datGoodSheet', 32, 32);
   	 	map.setCollisionByExclusion([]);

   	 	decorationLayer = map.createLayer('Background');
   	 	terrainLayer = map.createLayer('Walls');

   	 	map.setCollisionByExclusion([], true, terrainLayer);
   	 	
   	 	terrainLayer.resizeWorld();
   	 	//terrainLayer.debug = true;

		player = new Player(game, 'player');
		game.add.existing(player);
		
		sCam = game.add.sprite(player.x, player.y, 'atlas', 'cross');
		sCam.anchor.x = 0.5;
		sCam.anchor.y = 0.5;
		sCam.alpha = 0;

		game.camera.follow(sCam, null, .1, .1);
		this.physics.arcade.enable(sCam);

		enemies = game.add.group();
		enemyBullets = game.add.group();
		var enArr = [ 	[16,18], [24,20], [35,4], [31,9], [36,34], 
						[32,30], [17,37], [12,36], [6,20], [3,13], [3,21]];

		for(var i = 0; i < enArr.length; i++)
		{
			gunGuy = new GunGuy(enArr[i][0]*32 - 16, enArr[i][1]*32 - 16, game);
			game.add.existing(gunGuy);
			enemies.add(gunGuy);
		}


		walls.setAll('body.immovable', true);
		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function()
	{
		game.physics.arcade.collide(player, walls);
		game.physics.arcade.collide(player, terrainLayer);
		game.physics.arcade.collide(enemies, terrainLayer);
		game.physics.arcade.collide(player, enemyBullets, deadFun, null, this);
		mouseX = game.input.worldX;
		mouseY = game.input.worldY;	
		var tX = ((mouseX - player.x) / 6) + player.x;
		var tY = ((mouseY - player.y) / 6) + player.y;
		this.bitmap.context.clearRect(0, 0, this.world.width, this.world.height);

		//drawLines(gunGuy, this.bitmap);
		enemies.forEach(drawLines, this, true, this.bitmap);

		if(	this.math.difference(tX, sCam.x) > 1 || this.math.difference(tY, sCam.y) > 1)
		{
			var moveSpd = (this.math.difference(tX, sCam.x) + this.math.difference(tY, sCam.y))/2 * 45;
			this.physics.arcade.moveToXY(sCam, tX, tY, moveSpd);
		}
		else
		{
			sCam.body.velocity.y = 0;
			sCam.body.velocity.x = 0;
		}
	}
};

Final.Dead = function()
{
	var cursors;
};
Final.Dead.prototype =
{
	preload: function()
	{
		console.log('Dead: preload');
	},
	create: function()
	{
		console.log('Dead: create');
		this.add.text(25, 180, 'You died.\nPress Space to Restart!', {fontSize: '24px', fill: '#ffffff'});
		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			console.log("down!");
			game.state.start('Play');
		}
	}
};

function deadFun(player, bullet)
{
	bullet.destroy();
	game.state.start('Dead');
}
function drawLines(gunGuy, bitmap)
{
	gunGuy.graphics.clear();
	gunGuy.graphics.moveTo(gunGuy.x, gunGuy.y);
	gunGuy.graphics.lineStyle(2, 0xffffff, 1);

	gunGuy.graphics.lineTo(gunGuy.lessLine.end.x, gunGuy.lessLine.end.y);

	gunGuy.graphics.moveTo(gunGuy.x, gunGuy.y);
	gunGuy.graphics.lineTo(gunGuy.moreLine.end.x, gunGuy.moreLine.end.y);

	//gunGuy.graphics.moveTo(gunGuy.x, gunGuy.y);
	if(gunGuy.inCamera)
	{
		gunGuy.graphics.lineStyle(2, 0x2779B6, .5);	
		gunGuy.graphics.arc(gunGuy.x, gunGuy.y, gunGuy.lineDist, 0, Phaser.Math.degToRad(360), false, 60);
	}
}


// init game
var game = new Phaser.Game(512, 512, Phaser.AUTO);
// add states
game.state.add('Boot', Final.Boot);
game.state.add('Play', Final.Play);
game.state.add('Dead', Final.Dead);
game.state.start('Boot');