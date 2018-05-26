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

		this.load.path = './assets/tiles/';
		this.load.tilemap('bigRoom', 'bigRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('startRoom', 'startRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room1', 'room1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room2', 'room2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room3', 'room3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('datGoodSheet', 'Itch_32.png', 32, 32);
	},
	create: function()
	{
	}, 
	update: function()
	{
		game.state.start('MainMenu');
	}
};

Final.MainMenu = function(){ var button; };

Final.MainMenu.prototype = 
{
	init: function() 
	{
		console.log('Boot: init');
	},
	
	preload: function() 
	{
		console.log('Boot: preload');
	},
	create: function()
	{
		console.log('Boot: create');
		this.game.canvas.style.cursor = "crosshair";
		var startMusic = this.add.audio('music');
		//startMusic.play('', 0, .25, true);
		button = game.add.button(game.world.centerX - 55, game.world.centerY - 9,
									'atlas', startGame, this, 'startHover', 'start', 'startHover');

		var dude = game.add.sprite(game.world.centerX, game.world.centerY + 225, 'atlas', 'pl_RightIdle01');
		dude.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 3, true);
		dude.animations.play('rightIdle');
		dude.anchor.set(.5);
	}, 
	update: function()
	{
	}
}


Final.Play = function()
{
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, enemyBullets;
	var bigRoom, bloods;
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
		this.game.canvas.style.cursor = "crosshair";
		game.physics.startSystem(Phaser.Physics.ARCADE);

		walls = game.add.group();
		walls.enableBody = true;

   	 	bigRoom = game.add.tilemap('bigRoom');
		bigRoom.addTilesetImage('Itch_32', 'datGoodSheet', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.walls.resizeWorld();

		var mapArr = ['room1', 'room2', 'room3', 'room1', 'room2', 'room3'];
		var name = 'startRoom';

		var graph = [	[0, 0, 0, 0, 0], 
						[0, 0, 1, 0, 0],
						[0, 1, name, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0] ];

		generate(mapArr, graph);

		enemies = game.add.group();
		enemyBullets = game.add.group();
		renderRooms(graph, bigRoom);
		
		bigRoom.setCollisionByExclusion([], true, 'Walls');
		//bigRoom.walls.debug = true;

		enemies.forEach(generatePath, this, true, game, bigRoom.walls)
		bloods = game.add.group();
		player = new Player(game, 'player');
		game.add.existing(player);
		
		sCam = game.add.sprite(player.x, player.y, 'atlas', 'cross');
		sCam.anchor.x = 0.5;
		sCam.anchor.y = 0.5;
		sCam.alpha = 0;

		game.camera.follow(sCam, null, .1, .1);
		this.physics.arcade.enable(sCam);


		walls.setAll('body.immovable', true);
		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function()
	{
		//game.physics.arcade.collide(player, walls);
		this.game.canvas.style.cursor = "crosshair";
		game.physics.arcade.collide(player, bigRoom.walls);
		game.physics.arcade.collide(enemies, bigRoom.walls);
		game.physics.arcade.overlap(player, enemyBullets, deadFun, null, this);
		var onBlood = game.physics.arcade.overlap(player, bloods);
		if(onBlood && !player.onBlood)
			player.onBlood = true;
		else if(!onBlood)
			player.onBlood = false;


		mouseX = game.input.worldX;
		mouseY = game.input.worldY;	
		var tX = ((mouseX - player.x) / 6) + player.x;
		var tY = ((mouseY - player.y) / 6) + player.y;


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

	if(!player.dead)
	{
		player.dying();
	}

	player.dead = true;
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
		//gunGuy.graphics.lineStyle(2, 0x2779B6, .5);	
		//gunGuy.graphics.arc(gunGuy.x, gunGuy.y, gunGuy.lineDist, 0, Phaser.Math.degToRad(360), false, 60);
	}
}
function startGame()
{
	game.state.start('Play');
}

// init game
var game = new Phaser.Game(700, 700, Phaser.AUTO);
// add states
game.state.add('Boot', Final.Boot);
game.state.add('MainMenu', Final.MainMenu);
game.state.add('Play', Final.Play);
game.state.add('Dead', Final.Dead);
game.state.start('Boot');