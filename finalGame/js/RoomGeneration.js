function generate(rooms, graph)
{
	while(rooms.length > 0)
	{
		var found = false;
		var name = Phaser.ArrayUtils.removeRandomItem(rooms); //remove a random room from the room name array

		while(!found) //finds a spot
		{
			for(var i = 0; i < graph.length && !found; i++)
			{
				for(var k = 0; k < graph.length && !found; k++)
				{
					if(graph[i][k] === 1 && Math.random()*100 < 5) //if the spot is avaiable (== 1) put a room there 5% of the time
					{
						graph[i][k] = name;
						found = true;

						if(i + 1 < graph.length && graph[i+1][k] === 0)
						{
							graph[i+1][k] = 1;
						}
						if(k + 1 < graph.length && graph[i][k+1] === 0)
						{
							graph[i][k+1] = 1;
						}
						if(i - 1 >= 0 && graph[i-1][k] === 0)
						{
							graph[i-1][k] = 1;
						}
						if(k - 1 >= 0 && graph[i][k-1] === 0)
						{
							graph[i][k-1] = 1;
						}
					}
				}
			}
		}
	}

}

function renderRooms(graph, map, up)
{
	for(var i = 0; i < graph.length; i++)
	{
		for(var k = 0; k < graph.length; k++)
		{
			if(graph[i][k] !== 1 &&  graph[i][k] !== 0)
			{
				var room = game.add.tilemap(graph[i][k]);
				if(!up)
					room.addTilesetImage('tileset', 'datGoodSheet', 32, 32);
				else
					room.addTilesetImage('tileset', 'datGoodSheetUp', 32, 32);

				var worldX = 2 + k*16 - k; //top left corner x position
				var worldY = 4 + i*14 - i*2; //top left corner y position

				//copy background
				var layer = room.createLayer('Background');
				layer.alpha = 0;
				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.background);

				//copy walls
				layer  = room.createLayer('Walls');
				layer.alpha = 0;
				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.walls);

				//copy decorations
				layer = room.createLayer('Decorations');
				layer.alpha = 0;
				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.decorations);

				//copy shadows
				layer  = room.createLayer('Shadows');
				layer.alpha = 0;
				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.shadows);

				if(i + 1 >= graph.length || graph[i+1][k] === 1) //if the room is at the bottom, or if the room below it doesn't exist
				{
					//copy the bottom wall
					layer = room.createLayer('Down');
					layer.alpha = 0;
					data = room.copy(7, 12, 2, 2, layer);
					map.paste(worldX + 7, worldY + 12, data, map.walls);
				}
				if(k + 1 >= graph.length || graph[i][k+1] === 1) //if the room is the along the right edge, or if the room to the right of it doesn't exist
				{
					//copy the right wall
					layer = room.createLayer('Right');
					layer.alpha = 0;
					data = room.copy(15, 4, 1, 4, layer);
					map.paste(worldX + 15, worldY + 4, data, map.walls);
				}
				if(i - 1 < 0 || graph[i-1][k] === 1) //if the room is along the top edge, or if the room above it doesn't exist
				{
					//copy the top wall
					layer = room.createLayer('Up');
					layer.alpha = 0;
					data = room.copy(7, 0, 2, 2, layer);
					map.paste(worldX + 7, worldY, data, map.walls);

					//copy it's shadows
					layer = room.createLayer('UpShadows');
					layer.alpha = 0;
					data = room.copy(7, 0, 2, 3, layer);
					map.paste(worldX + 7, worldY, data, map.shadows);
				}
				if(k - 1 < 0 || graph[i][k-1] === 1) //if the room is along the left edge, or if the room to the left of it doesn't exist
				{
					//copy its left wall
					layer = room.createLayer('Left');
					layer.alpha = 0;
					data = room.copy(0, 4, 1, 4, layer);
					map.paste(worldX, worldY + 4, data, map.walls);

					//copy its shadows
					layer = room.createLayer('LeftShadows');
					layer.alpha = 0;
					data = room.copy(0, 6, 2, 2, layer);
					map.paste(worldX, worldY + 6, data, map.shadows);
				}

				//copy the enemy layer
				layer = room.createLayer('Enemy');
				layer.alpha = 0;

				room.setCollisionByExclusion([], true, layer);

				var arr = layer.getTiles(0, 0, 16*32, 14*32, true);

				var numEnPerRoom = 2; //number of enemies that will spawn

				if(up) //if on the second level, randomly choose between 2 or 3 enemies
				{
					numEnPerRoom += Math.random()*1.5;
					numEnPerRoom--;
				}

				//randomly pick numEnPerRoom spawn points from the 4 in the room
				for(var n = 0; arr.length > 0 && n < numEnPerRoom; n++)
				{
					var tile = Phaser.ArrayUtils.removeRandomItem(arr);
					if(Math.random()*100 < 50)
						var guy = new GunGuy((worldX)*32 + tile.worldX, (worldY)*32 + tile.worldY, game);
					else
					{
						var guy = new Turret((worldX)*32 + tile.worldX, (worldY)*32 + tile.worldY, game);
					}
					game.add.existing(guy);
					enemies.add(guy);
					numEnemies++;
				}

				room.destroy();
			}
		}
	}
}