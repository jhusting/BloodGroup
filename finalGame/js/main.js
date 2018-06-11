//Music: "Electro Zombies" by Purple Planet Music
//http://www.purple-planet.com/dark-backgrounds/4584537439
//Machine gun Gunshot Sound: "Gun Shot.wav" by Bird_man
//https://freesound.org/people/Bird_man/sounds/275151/
//player lazer sound: "Laser shot silenced" by buboproducer
//https://freesound.org/people/bubaproducer/sounds/151022/
//Turret lazer sound: "laser" by fins
//https://freesound.org/people/fins/sounds/191594/

// define global game container object
var Final = { };

var lowspec = false;

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

		//load font
		this.load.path = './assets/fonts/';
		this.load.bitmapFont('pixelFont', 'font.png', 'font.fnt', null);

		//load all images and sprite sheets
		this.load.path = './assets/img/'; //set initial load path
		this.load.atlas('atlas', 'spritesheet.png', 'sprites.json');
		this.load.image('titleBG', 'Title Screen_NoText.png');
		this.load.image('winBG', 'WinScreen_1.png');
		this.load.image('deathBG', 'Death_Screen.png');
		this.load.image('pBlood', 'pBlood.png');

		//load all audio
		this.load.audio('music', '../audio/Electro_Zombies.mp3');
		this.load.audio('shot', '../audio/shot.wav');
		this.load.audio('playerShot', '../audio/playerShot.wav');
		this.load.audio('turretShot', '../audio/turretShot.wav');

		//load tilesets and tilemaps for first level
		this.load.path = './assets/tiles/Athene/';
		this.load.tilemap('tutorial', '/upper/tutorial.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('bigRoom', 'bigRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('startRoom', 'startRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room1', 'room1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room2', 'room2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room3', 'room3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room4', 'room4.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room5', 'room5.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room6', 'room6.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('datGoodSheet', 'tileset.png', 32, 32);

		//load tilesets and tilemaps for second level
		this.load.path = './assets/tiles/Athene/upper/';
		this.load.tilemap('bigRoomUp', 'bigRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('startRoomUp', 'startRoom.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room1Up', 'room1.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room2Up', 'room2.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room3Up', 'room3.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room4Up', 'room4.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room5Up', 'room5.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.tilemap('room6Up', 'room6.json', null, Phaser.Tilemap.TILED_JSON);
		this.load.spritesheet('datGoodSheetUp', 'tileset.png', 32, 32);


	},
	create: function()
	{
		var startMusic = this.add.audio('music');
		startMusic.play('', 0, .25, true);
	}, 
	update: function()
	{
		game.state.start('MainMenu');
	}
};

Final.MainMenu = function(){ var button, low; };

Final.MainMenu.prototype = 
{
	init: function() 
	{
		console.log('MainMenu: init');
	},
	
	preload: function() 
	{
		console.log('MainMenu: preload');
	},
	create: function()
	{
		console.log('MainMenu: create');
		this.game.canvas.style.cursor = "crosshair";
		game.add.image(0, 0, 'titleBG');

		//Add buttons for switching states
		button = game.add.button(game.world.width/5, 665,
									'atlas', startGame, this, 'Quick Start', 'Quick Start_Blank', 'Quick Start');
		button.anchor.set(0.5, 0.5);

		var button2 = game.add.button(game.world.width*(2/5), 665,
									'atlas', startTutorial, this, 'Start', 'Start_Blank', 'Start');
		button2.anchor.set(0.5, 0.5);

		var button3 = game.add.button(game.world.width*(3/5), 665,
									'atlas', toggleFPS, this, 'Low Spec Mode', 'Low Spec Mode_Blank', 'Low Spec Mode');
		button3.anchor.set(0.5, 0.5);

		var button4 = game.add.button(game.world.width*(4/5), 665,
									'atlas', startCredits, this, 'Credits', 'Credits_Blank', 'Credits');
		button4.anchor.set(0.5, 0.5);
	}, 
	update: function()
	{
	}
}

Final.Credits = function(){ var button; };

Final.Credits.prototype = 
{
	init: function() 
	{
		console.log('Credits: init');
	},
	
	preload: function() 
	{
		console.log('Credits: preload');
	},
	create: function()
	{
		console.log('Credits: create');

		var text = game.add.bitmapText(32, 32, 'pixelFont', 
				'Music' + 
				'\n\"Electro Zombies\" by Purple Planet Music' + 
				'\nhttp://www.purple-planet.com/dark-backgrounds/4584537439' + 
				'\n\nSounds' + 
				'\nMachine Gun Enemy Sound: \"Gun Shot.wav\" by Bird_man' + 
				'\nhttps://freesound.org/people/Bird_man/sounds/275151/' + 
				'\nPlayer Laser sound: \"Laser shot silenced\" by buboproducer' +
				'\nhttps://freesound.org/people/bubaproducer/sounds/151022/' + 
				'\nTurret lazer sound: \"laser\" by fins' + 
				'\nhttps://freesound.org/people/fins/sounds/191594/' + 
				'\n\nEnvironmental Art' + 
				'\nAthene Yip\nJosh Husting' +
				'\n\nCharacter Art' + 
				'\nAaron Miranda' + 
				'\n\nProgramming' + 
				'\nJosh Husting' + 
				'\n\nPress SPACE to return to the main menu. . .', 20);
	}, 
	update: function()
	{
		this.game.canvas.style.cursor = "crosshair";
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
			game.state.start('MainMenu');
	}
}

Final.Tutorial = function() 
{ 
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, enemyBullets, numEnemies;
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

		//setup main tilemap
		//this is the only tilemap that will be displayed, we will load individual rooms and 
		//copy them to this tilemap when generating the world
		bigRoom = game.add.tilemap('tutorial');
		bigRoom.addTilesetImage('tileset', 'datGoodSheetUp', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.shadows = bigRoom.createLayer('Shadows');
		bigRoom.walls.resizeWorld();

		//set the wall layer to collide
		bigRoom.setCollisionByExclusion([], true, 'Walls');

		player = new Player(game, 'player');
		game.add.existing(player);
		player.tutorial = true;

		cursors = game.input.keyboard.createCursorKeys();

		bloods = game.add.group();
		corpses = game.add.group();
		enemyBullets = game.add.group();
		enemies = game.add.group();
		numEnemies = 0;

		//Set up first line of tutorial text
		line = 1;
		text = game.add.bitmapText(32, 32, 'pixelFont', '\"Alright One-Twenty, let\'s continue with the tests.\"' + 
					'\n\"Let\'s have you move around for me.\"' + 
					'\n\nWASD to move.', 20);
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
			//Setup second line of tutorial text
			line = 2;
			text.destroy();
			text = game.add.bitmapText(32, 32, 'pixelFont', '\"The gun we\'ve outfitted you with is dangerous: firing the weapon' + 
				'\ndraws all the blood from body and propels it out the barrel.' + 
				'\n\n\"Luckily, since you are a blood imp, you seem to have a lot of' + 
				'\nblood.\"' + '\n\nPress SPACE to continue. . .', 20);
		}

		if(line == 2 && game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			//Setup third line of tutorial text
			line = 3;

			var puddle;
			if(Math.random()*100 < 50)
				puddle = game.add.sprite(352 - 128, 17*32, 'atlas', 'puddle1');
			else
				puddle = game.add.sprite(352 - 128, 17*32, 'atlas', 'puddle2');

			//Spawn a tutorial enemy
			var enemy = new Enemy(352 + 128, 17*32, game, 'gunGuy');
			game.add.existing(enemy);
			enemies.add(enemy);
			enemy.animations.add('idle', Phaser.Animation.generateFrameNames('EnemyIdle', 1, 6, '', 2), 3, true);
			enemy.animations.play('idle');

			text.destroy();
			text = game.add.bitmapText(32, 32, 'pixelFont', '\"Hold left click and aim with the mouse to fire the gun, but be' + 
				'\ncareful: once you\'ve fired you have no more blood, and will soon' + '\ndie.\"' +
				'\n\n\"In order to regain your blood you must eat a corpse.\"' + 
				'\n\nHold E while on top of a corpse to eat it.', 20);
		}

		if(line == 3 && game.input.keyboard.isDown(Phaser.Keyboard.E))
		{
			//Setup fourth line of tutorial text
			line = 4;
			text.destroy();

			//Spawn another tutorial enemy
			var enemy = new Enemy(352 - 64, 17*32, game, 'gunGuy');
			game.add.existing(enemy);
			enemies.add(enemy);
			enemy.animations.add('idle', Phaser.Animation.generateFrameNames('EnemyIdle', 1, 6, '', 2), 3, true);
			enemy.animations.play('idle');

			text.destroy();
			text = game.add.bitmapText(32, 32, 'pixelFont', '\"You move quicker and run out of blood slower when standing on'+ 
				'\nblood.\"' +  
				'\n\n\"You can also stealth kill an enemy by pressing F when near them' + 
				'\nand not seen.\"', 20);
		}

		if(line == 4 && game.input.keyboard.isDown(Phaser.Keyboard.F))
		{
			//Setup last line of tutorial text
			line = 5;
			text.destroy();
			text = game.add.bitmapText(32, 32, 'pixelFont', 'Press space to continue. . .', 20);
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

		//This state is only meant as a transition between the tutorial and the main game
		var text = game.add.bitmapText(32, 350-32, 'pixelFont', 'This is the story of how you break out of the facility that'+ 
				'\nhas tested and tortured you for years.' + 
				'\n\nPress SPACE to begin your escape.', 20);
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
	var gunGuy, enemies, map, enemyBullets, numEnemies;
	var bigRoom, bloods, corpses, stairs;
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
		numEnemies = 0;

		//setup main tilemap
		//this is the only tilemap that will be displayed, we will load individual rooms and 
		//copy them to this tilemap when generating the world
   	 	bigRoom = game.add.tilemap('bigRoom');
		bigRoom.addTilesetImage('tileset', 'datGoodSheet', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.decorations = bigRoom.createLayer('Decorations');
		bigRoom.shadows = bigRoom.createLayer('Shadows');
		bigRoom.walls.resizeWorld();

		//mapArr is an array of strings that contain the names of all the rooms for this level
		var mapArr = ['room1', 'room2', 'room3', 'room4', 'room5', 'room6'];
		var name = 'startRoom'; //The name of the first room to spawn

		//this contains the layout for the current level
		//a string in an element means that tilemap will be copied into that spot, a 1 means a room
		//can be placed in that spot. a 0 means that spot is empty and a room cannot be placed there
		var graph = [	[0, 0, 0, 0, 0], 
						[0, 0, 1, 0, 0],
						[0, 1, name, 1, 0],
						[0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0] ];

		//randomly populate the array to generate the level
		generate(mapArr, graph);

		//add groups for blood and corpse sprites
		bloods = game.add.group();
		corpses = game.add.group();
		//add groups for the enemies and their bullets
		enemies = game.add.group();
		enemyBullets = game.add.group();

		//copy each tilemap into their correct spot in the bigRoom tilemap
		renderRooms(graph, bigRoom, false);
		
		//setup collision
		bigRoom.setCollisionByExclusion([], true, 'Walls');
		//bigRoom.walls.debug = true;

		//call the generate path function for every enemy
		enemies.forEach(generatePath, this, true, game, bigRoom.walls);

		player = new Player(game, 'player', game.world.width/2 , game.world.height/2 - 64);
		game.add.existing(player);
		
		//add our camera object
		sCam = game.add.sprite(player.x, player.y, 'atlas', 'cross');
		sCam.anchor.x = 0.5;
		sCam.anchor.y = 0.5;
		sCam.alpha = 0;

		if(!lowspec)
		{
			game.camera.follow(sCam, null, .1, .1);
			this.physics.arcade.enable(sCam);
		}
		else
			game.camera.follow(player, null, .1, .1);

		stairs = null;

		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function()
	{
		if(this.game.canvas.style.cursor != 'crosshair')
			this.game.canvas.style.cursor = "crosshair";

		//check for overlap with stairs if it exists
		if(stairs !== null)
		{
			game.physics.arcade.overlap(player, stairs, function() {
				game.state.start('Upper');
			}, null, this);
		}

		//setup collisions
		game.physics.arcade.collide(player, bigRoom.walls);
		game.physics.arcade.collide(enemies, bigRoom.walls);
		game.physics.arcade.overlap(player, enemyBullets, deadFun, null, this);

		//check if the player is on a blood particle
		var onBlood = game.physics.arcade.overlap(player, bloods);

		if(onBlood && !player.onBlood)
			player.onBlood = true;
		else if(!onBlood)
			player.onBlood = false;

		//check if each bullet is colliding with a wal
		enemyBullets.forEach(bulletKill, this, true);

		//if their are no enemies, spawn the stairs and the pointer to the stairs
		if(numEnemies <= 0 &&  stairs === null)
		{
			stairs = game.add.sprite(game.world.width/2 + 3*32, game.world.height/2 - 64 - 16, 'atlas', 'stairs');
			stairs.anchor.set(0.5);
			game.physics.arcade.enable(stairs);

			var arrow = new Arrow(game, stairs, 1, 0, player.x, player.y);
			game.add.existing(arrow);
		}

		if(!lowspec)
		{
			//calculate where the camera should be
			mouseX = game.input.worldX;
			mouseY = game.input.worldY;	
			var tX = ((mouseX - player.x) / 6) + player.x;
			var tY = ((mouseY - player.y) / 6) + player.y;

			//if the camera is more than 1 pixel away from the calculated spot, move it
			if(	this.math.difference(tX, sCam.x) > 1 || this.math.difference(tY, sCam.y) > 1)
			{
				//moves slower when the distance is smaller
				var moveSpd = (this.math.difference(tX, sCam.x) + this.math.difference(tY, sCam.y))/2 * 45;
				this.physics.arcade.moveToXY(sCam, tX, tY, moveSpd);
			}
			else
			{
				sCam.body.velocity.y = 0;
				sCam.body.velocity.x = 0;
			}
		}
	}
};

Final.Upper = function()
{
	var cursors, player, sCam, mouseX, mouseY, walls;
	var gunGuy, enemies, map, enemyBullets, numEnemies;
	var bigRoom, bloods, corpses, stairs, stairsBool;
};
Final.Upper.prototype =
{
	preload: function()
	{
		console.log('Upper: preload');
	},
	create: function()
	{
		console.log('Upper: create');

		this.game.canvas.style.cursor = "crosshair";
		game.physics.startSystem(Phaser.Physics.ARCADE);
		numEnemies = 0;

		//setup main tilemap
		//this is the only tilemap that will be displayed, we will load individual rooms and 
		//copy them to this tilemap when generating the world
   	 	bigRoom = game.add.tilemap('bigRoomUp');
		bigRoom.addTilesetImage('tileset', 'datGoodSheetUp', 32, 32);
		bigRoom.background = bigRoom.createLayer('Background');
		bigRoom.walls = bigRoom.createLayer('Walls');
		bigRoom.decorations = bigRoom.createLayer('Decorations');
		bigRoom.shadows = bigRoom.createLayer('Shadows');
		bigRoom.walls.resizeWorld();

		//mapArr is an array of strings that contain the names of all the rooms for this level
		var mapArr = ['room1Up', 'room2Up', 'room3Up', 'room4Up', 'room5Up', 'room6Up'];
		var name = 'startRoomUp'; //The name of the first room to spawn

		//this contains the layout for the current level
		//a string in an element means that tilemap will be copied into that spot, a 1 means a room
		//can be placed in that spot. a 0 means that spot is empty and a room cannot be placed there
		var graph = [	[0, 1, name, 1, 0], 
						[0, 0, 1, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[0, 0, 0, 0, 0] ];

		//randomly populate the array to generate the level
		generate(mapArr, graph);

		//add groups for blood and corpse sprites
		bloods = game.add.group();
		corpses = game.add.group();
		//add groups for the enemies and their bullets
		enemies = game.add.group();
		enemyBullets = game.add.group();

		//copy each tilemap into their correct spot in the bigRoom tilemap
		renderRooms(graph, bigRoom, true);
		
		//setup collision
		bigRoom.setCollisionByExclusion([], true, 'Walls');
		//bigRoom.walls.debug = true;

		//call the generate path function for every enemy
		enemies.forEach(generatePath, this, true, game, bigRoom.walls);

		player = new Player(game, 'player', game.world.width/2, 11*32);
		game.add.existing(player);
		
		//add our camera object
		sCam = game.add.sprite(player.x, player.y, 'atlas', 'cross');
		sCam.anchor.x = 0.5;
		sCam.anchor.y = 0.5;
		sCam.alpha = 0;

		if(!lowspec)
		{
			game.camera.follow(sCam, null, .1, .1);
			this.physics.arcade.enable(sCam);
		}
		else
			game.camera.follow(player, null, .1, .1);

		stairs = null;
		stairs = game.add.sprite(game.world.width/2, 128 + 64, 'atlas', 'SlidingDoor01');
		game.physics.arcade.enable(stairs);
		stairs.anchor.set(0.5, 0.5);
		stairs.body.immovable = true;
		stairsBool = false;

		cursors = game.input.keyboard.createCursorKeys();
	},
	update: function()
	{
		if(this.game.canvas.style.cursor != 'crosshair')
			this.game.canvas.style.cursor = "crosshair";

		//check for overlap with stairs if it exists
		if(stairsBool)
		{
			game.physics.arcade.overlap(player, stairs, function() {
				game.state.start('Won');
			}, null, this);
		}

		//setup collisions
		game.physics.arcade.collide(player, stairs);
		game.physics.arcade.collide(player, bigRoom.walls);
		game.physics.arcade.collide(enemies, bigRoom.walls);
		game.physics.arcade.overlap(player, enemyBullets, deadFun, null, this);

		//check if the player is on a blood particle
		var onBlood = game.physics.arcade.overlap(player, bloods);

		if(onBlood && !player.onBlood)
			player.onBlood = true;
		else if(!onBlood)
			player.onBlood = false;

		//check if each bullet is colliding with a wal
		enemyBullets.forEach(bulletKill, this, true);

		//if their are no enemies, spawn the stairs and the pointer to the stairs
		if(numEnemies <= 0)
		{
			stairs.frameName = 'SlidingDoor02';

			stairsBool = true;
			var arrow = new Arrow(game, stairs, 1, 0, player.x, player.y);
			game.add.existing(arrow);
		}

		if(!lowspec)
		{
			//calculate where the camera should be
			mouseX = game.input.worldX;
			mouseY = game.input.worldY;	
			var tX = ((mouseX - player.x) / 6) + player.x;
			var tY = ((mouseY - player.y) / 6) + player.y;

			//if the camera is more than 1 pixel away from the calculated spot, move it
			if(	this.math.difference(tX, sCam.x) > 1 || this.math.difference(tY, sCam.y) > 1)
			{
				//moves slower when the distance is smaller
				var moveSpd = (this.math.difference(tX, sCam.x) + this.math.difference(tY, sCam.y))/2 * 45;
				this.physics.arcade.moveToXY(sCam, tX, tY, moveSpd);
			}
			else
			{
				sCam.body.velocity.y = 0;
				sCam.body.velocity.x = 0;
			}
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
		cursors = game.input.keyboard.createCursorKeys();
		this.add.image(0, 0, 'deathBG');
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Play');
		}
	}
};

Final.Won = function()
{
	var cursors;
};
Final.Won.prototype =
{
	preload: function()
	{
		console.log('Won: preload');
	},
	create: function()
	{
		console.log('Won: create');
		cursors = game.input.keyboard.createCursorKeys();
		this.add.image(0, 0, 'winBG');
		var player = this.add.sprite(280, 620, 'atlas', 'pl_RightIdle01');
		player.animations.add('rightIdle', Phaser.Animation.generateFrameNames('pl_RightIdle', 1, 2, '', 2), 2, true);
		player.animations.play('rightIdle');
	},
	update: function()
	{
		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
		{
			game.state.start('Credits');
		}
	}
};

function bulletKill(bullet)
{
	var intersects = bigRoom.walls.getTiles(bullet.x, bullet.y, 4, 4, true);

	if(intersects.length > 0)
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
	gunGuy.graphics.moveTo(gunGuy.lessLine.start.x, gunGuy.lessLine.start.y);
	gunGuy.graphics.lineStyle(2, 0xffffff, .75);	

	gunGuy.graphics.lineTo(gunGuy.lessLine.end.x, gunGuy.lessLine.end.y);

	gunGuy.graphics.moveTo(gunGuy.moreLine.start.x, gunGuy.moreLine.start.y);
	gunGuy.graphics.lineTo(gunGuy.moreLine.end.x, gunGuy.moreLine.end.y);
}
function startGame()
{
	game.state.start('Play');
}
function startTutorial()
{
	game.state.start('Tutorial');
}
function startCredits()
{
	game.state.start('Credits');
}
function toggleFPS(button)
{
	lowspec = !lowspec;

	if(lowspec)
	{
		this.time.desiredFps = 30;
		button.setFrames('Low Spec Mode', 'Low Spec Mode', 'Low Spec Mode');
	}
	else
	{
		this.time.desiredFps = 60;
		button.setFrames('Low Spec Mode', 'Low Spec Mode_Blank', 'Low Spec Mode');
	}

	console.log('desired fps: ' + this.time.desiredFps + 
				'\nlowspec: '  + lowspec);
}

// init game
var game = new Phaser.Game(700, 700, Phaser.AUTO);
// add states
game.state.add('Boot', Final.Boot);
game.state.add('MainMenu', Final.MainMenu);
game.state.add('Credits', Final.Credits);
game.state.add('Tutorial', Final.Tutorial);
game.state.add('Transition', Final.Transition);
game.state.add('Play', Final.Play);
game.state.add('Upper', Final.Upper);
game.state.add('Dead', Final.Dead);
game.state.add('Won', Final.Won);
game.state.start('Boot');