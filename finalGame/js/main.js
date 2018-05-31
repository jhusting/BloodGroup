//Final Proto by Josh Husting
//CMPM 120
//
//Music: "Electro Zombies" by Purple Planet Music
//http://www.purple-planet.com/dark-backgrounds/4584537439
//Machine gun Gunshot Sound: "Gun Shot.wav" by Bird_man
//https://freesound.org/people/Bird_man/sounds/275151/
//Player lazer sound: "Laser shot silenced" by buboproducer
//https://freesound.org/people/bubaproducer/sounds/151022/
//Turret lazer sound: "laser" by fins
//https://freesound.org/people/fins/sounds/191594/

// define global game container object
var Final = { };

let textStyle = 
{
	font: 'ProggyTinyTTSZ',
	fontSize: 32,
	fill: '#ffffff',
	wordWrap: true,
	wordWrapWidth: (700-64),
	align: 'left'
};

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
		this.load.image('BGTile', 'BGTile.png');
		this.load.audio('music', '../audio/Electro_Zombies.mp3');
		this.load.audio('shot', '../audio/shot.wav');
		this.load.audio('playerShot', '../audio/playerShot.wav');
		this.load.audio('turretShot', '../audio/turretShot.wav');

		this.load.path = './assets/tiles/Athene/';
		this.load.tilemap('tutorial', 'tutorial.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('bigRoom', 'bigRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('startRoom', 'startRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room1', 'room1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room2', 'room2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room3', 'room3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room4', 'room4.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room5', 'room5.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room6', 'room6.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('datGoodSheet', 'tileset.png', 32, 32);
	},
	create: function()
	{
		//this.time.desiredFps = 30;
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
		startMusic.play('', 0, .25, true);
		button = game.add.button(game.world.centerX - 55, game.world.centerY - 9,
									'atlas', startGame, this, 'startHover', 'start', 'startHover');
		var button2 = game.add.button(game.world.centerX - 55, game.world.centerY - 9 + 18,
									'atlas', startTutorial, this, 'controlsHover', 'controls', 'controlsHover');

		var dude = game.add.sprite(game.world.centerX, game.world.centerY + 225, 'atlas', 'pl_RightIdle01');
		dude.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 3, true);
		dude.animations.play('rightIdle');
		dude.anchor.set(.5);
	}, 
	update: function()
	{
	}
}

Final.Tutorial = function() 
{ 
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, enemyBullets;
	var bigRoom, bloods, corpses, text, line, lineCounter; 
};
Final.Tutorial.prototype = 
{
	init: function() 
	{
		console.log('Tutorial: init');
	},
	
	preload: function()
	{
		console.log('Tutorial: preload');
	},
	create: function()
	{
		console.log('Tutorial: create');
		bigRoom = game.add.tilemap('tutorial');
		bigRoom.addTilesetImage('tileset', 'datGoodSheet', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.shadows = bigRoom.createLayer('Shadows');
		bigRoom.walls.resizeWorld();

		bigRoom.setCollisionByExclusion([], true, 'Walls');

		player = new Player(game, 'player');
		game.add.existing(player);
		player.tutorial = true;

		cursors = game.input.keyboard.createCursorKeys();

		enemies = game.add.group();
		enemyBullets = game.add.group();
		corpses = game.add.group();
		bloods = game.add.group();

		let textStyle = 
		{
			font: 'ProggyTinyTTSZ',
			fontSize: 32,
			fill: '#ffffff',
			wordWrap: true,
			wordWrapWidth: (700-64),
			align: 'left'
		};

		line = 1;
		text = game.add.text(32, 32, '\"Alright #120, let\'s continue with the tests.\"' + 
					'\n\"Let\'s have you move around for me.\" (WASD)', textStyle);
		lineCounter = 0;

		player.x = 352;
		player.y = 17*32;
	}, 
	update: function()
	{
		this.game.canvas.style.cursor = "crosshair";
		game.physics.arcade.collide(player, bigRoom.walls);

		if(line == 1 && (game.input.keyboard.isDown(Phaser.Keyboard.W) || 
			game.input.keyboard.isDown(Phaser.Keyboard.S) ||
			game.input.keyboard.isDown(Phaser.Keyboard.A) || 
			game.input.keyboard.isDown(Phaser.Keyboard.D)))
		{
			line = 2;
			text.destroy();
			text = game.add.text(32, 32, '\"The gun we\'ve outfitted you is dangerous: firing the weapon draws all ' +  
				'the blood from body and propels it out the barrel. Luckily, since you are a blood imp, you seem to ' +
				'have a lot of blood.\"' + '\n\nPress space to continue. . .', textStyle);
		}

		if(line == 2 && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			line = 3;
			var corpse = new Corpse(game, 1, 0, 352 - 128, 17*32);
			game.add.existing(corpse);
			corpses.add(corpse);

			text.destroy();
			text = game.add.text(32, 32, '\"Hold left click and aim with the mouse to fire the gun, but be careful: ' +  
				'once you\'ve fired you have no more blood, and will soon die.\"' +
				'\n\"In order to regain your blood you must eat a corpse. Hold E while on top of a corpse to eat it.\"', textStyle);
		}

		if(line == 3 && game.input.keyboard.isDown(Phaser.Keyboard.E))
		{
			line = 4;
			text.destroy();
			var enemy = new Enemy(352 + 128, 17*32, game, 'gunGuy');
			game.add.existing(enemy);
			enemies.add(enemy);

			text = game.add.text(32, 32, '\"You move quicker and run out of blood slower when standing on blood.\"' +  
				'\n\"You can also stealth kill an enemy by pressing F when near them and not seen.\"', textStyle);
		}

		if(line == 4 && game.input.keyboard.isDown(Phaser.Keyboard.F))
		{
			line = 5;
			text.destroy();
			text = game.add.text(32, 32, 'Press space to continue. . .', textStyle);
		}

		if(line == 5 && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Transition');
		}

		var onBlood = game.physics.arcade.overlap(player, bloods);
		if(onBlood && !player.onBlood)
			player.onBlood = true;
		else if(!onBlood)
			player.onBlood = false;
	}
};

Final.Transition = function(){ var button; };

Final.Transition.prototype = 
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

		var text = game.add.text(32, 350-32, 'This is story of how you break out of the facility that has tested and ' +  
				'tortured you for years. \n\nPress space to begin your escape.', textStyle);
	}, 
	update: function()
	{
		this.game.canvas.style.cursor = "crosshair";
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			game.state.start('Play');
	}
}

Final.Play = function()
{
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, enemyBullets;
	var bigRoom, bloods, corpses;
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
		bigRoom.addTilesetImage('tileset', 'datGoodSheet', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.shadows = bigRoom.createLayer('Shadows');
		bigRoom.walls.resizeWorld();

		var mapArr = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6'];
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

		corpses = game.add.group();

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
		//game.physics.arcade.collide(enemyBullets, bigRoom.walls, bulletKill, null, this);
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
		this.add.text(25, 180, 'You died.\nPress Space to Restart!', textStyle);
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

function bulletKill(bullet)
{
	bullet.destroy();
}

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
function startTutorial()
{
	game.state.start('Tutorial');
}

// init game
var game = new Phaser.Game(700, 700, Phaser.AUTO);
// add states
game.state.add('Boot', Final.Boot);
game.state.add('MainMenu', Final.MainMenu);
game.state.add('Tutorial', Final.Tutorial);
game.state.add('Transition', Final.Transition);
game.state.add('Play', Final.Play);
game.state.add('Dead', Final.Dead);
game.state.start('Boot');