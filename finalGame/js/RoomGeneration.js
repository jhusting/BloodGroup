function generate(rooms, graph)
{
	//var size = rooms.length;
	while(rooms.length > 0)
	{
		var found = false;
		var name = Phaser.ArrayUtils.removeRandomItem(rooms);

		while(!found)
		{
			for(var i = 0; i < graph.length && !found; i++)
			{
				for(var k = 0; k < graph.length && !found; k++)
				{
					if(graph[i][k] === 1 && Math.random()*100 < 5)
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

function renderRooms(graph, map)
{
	for(var i = 0; i < graph.length; i++)
	{
		for(var k = 0; k < graph.length; k++)
		{
			if(graph[i][k] !== 1 &&  graph[i][k] !== 0)
			{
				var room = game.add.tilemap(graph[i][k]);
				room.addTilesetImage('Itch_32', 'datGoodSheet', 32, 32);
				var worldX = 2 + k*16 - k;
				var worldY = 4 + i*14 - i*2;

				var layer = room.createLayer('Background');
				layer.alpha = 0;

				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.background);

				layer  = room.createLayer('Walls');
				layer.alpha = 0;

				data = room.copy(0, 0, 16, 15, layer);
				map.paste(worldX, worldY, data, map.walls);

				if(i + 1 >= graph.length || graph[i+1][k] === 1)
				{
					layer = room.createLayer('Down');
					layer.alpha = 0;

					data = room.copy(7, 12, 2, 2, layer);
					map.paste(worldX + 7, worldY + 12, data, map.walls);
				}
				if(k + 1 >= graph.length || graph[i][k+1] === 1)
				{
					layer = room.createLayer('Right');
					layer.alpha = 0;

					data = room.copy(15, 4, 1, 4, layer);
					map.paste(worldX + 15, worldY + 4, data, map.walls);
				}
				if(i - 1 < 0 || graph[i-1][k] === 1)
				{
					layer = room.createLayer('Up');
					layer.alpha = 0;

					data = room.copy(7, 0, 2, 2, layer);
					map.paste(worldX + 7, worldY, data, map.walls);
				}
				if(k - 1 < 0 || graph[i][k-1] === 1)
				{
					layer = room.createLayer('Left');
					layer.alpha = 0;

					data = room.copy(0, 4, 1, 4, layer);
					map.paste(worldX, worldY + 4, data, map.walls);
				}

				layer = room.createLayer('Enemy');
				layer.alpha = 0;

				room.setCollisionByExclusion([], true, layer);

				var arr = layer.getTiles(0, 0, 16*32, 14*32, true);

				for(var n = 0; arr.length > 0 && n < 2; n++)
				{
					var tile = Phaser.ArrayUtils.removeRandomItem(arr);
					console.log('worldX: ' + worldX + '\ntilex: ' + tile.x);
					var guy = new GunGuy((worldX)*32 + tile.worldX, (worldY)*32 + tile.worldY, game);
					game.add.existing(guy);
					enemies.add(guy);
				}

				room.destroy();
			}
		}
	}
}