var StageScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function StageScene() {
			Phaser.Scene.call(this, { key: 'stage' });
		},

	create: function () {

		window.MyScene = this;

		var self = this;

		//this.shapes = this.cache.json.get('shapes');

		const map = this.make.tilemap({ key: "map" });

		const tileset = map.addTilesetImage("background", "tiles3");

		//this.belowLayer = map.createStaticLayer("floor layer", tileset, 0, 0);
		this.worldLayer = map.createStaticLayer("Capa de patrones 1", tileset, 0, 0);
		this.worldLayer.setCollisionByProperty({ collides: true });
		this.worldLayer2 = map.createStaticLayer("Capa de patrones 5", tileset, 0, 0);
		this.worldLayer2.setCollisionByProperty({ collides: true });
		this.worldLayer3 = map.createStaticLayer("Capa de patrones 2", tileset, 0, 0);
		this.worldLayer3.setCollisionByProperty({ collides: true });
		this.worldLayer4 = map.createStaticLayer("Capa de patrones 3", tileset, 0, 0);
		this.worldLayer4.setCollisionByProperty({ collides: true });
		this.worldLayer5 = map.createStaticLayer("Capa de patrones 4", tileset, 0, 0);
		this.worldLayer5.setCollisionByProperty({ collides: true });


		game.config.width = this.worldLayer.width;
		game.config.height = this.worldLayer.height;

		this.matter.world.convertTilemapLayer(this.worldLayer);
		this.matter.world.convertTilemapLayer(this.worldLayer2);
		this.matter.world.convertTilemapLayer(this.worldLayer3);
		this.matter.world.convertTilemapLayer(this.worldLayer4);
		this.matter.world.convertTilemapLayer(this.worldLayer5);


		//this.aGrid = new AlignGrid({ scene: this, rows: 10, cols: 20 });
		//this.aGrid.showNumbers();
		//this.matter.world.setBounds(map.widthInPixels, map.heightInPixels);

		this.matter.world.on('collisionstart', function (event, bodyA, bodyB) {
			event.pairs.forEach(pair => {
				const { bodyA, bodyB } = pair;

				const gameObjectA = bodyA.gameObject;
				const gameObjectB = bodyB.gameObject;

				const aIsPlayer = gameObjectA instanceof Phaser.GameObjects.Container;
				const bIsPlayer = gameObjectB instanceof Phaser.GameObjects.Container;

				if (aIsPlayer && bIsPlayer) {
					//appSocket.helpers.playersCollision(gameObjectA, gameObjectB);
				}
			});
		});

		this.actual_direction = 0;

		//this.matter.world.createDebugGraphic();

		this.cursors = this.input.keyboard.createCursorKeys();
		/*this.input.keyboard.addKeys({
			up: 'up',
			down: 'down',
			left: 'left',
			right: 'right'
		});*/

		//$('#buttonParty').on('click', () => { appUI.addLoading(); this.goToParty(self) });
		this.cameras.main.backgroundColor = Phaser.Display.Color.HexStringToColor("#3B335A");
		this.cameras.main.setZoom(2);


		//this.socket = appSocket.stage(self, userId, roomId, user);
		//this.background = this.sound.add('stageSound');
		//showRules();
		//this.background.play();

		this.players = [];
		
	},
	update: function () {
		if (this.players) {
			this.players.forEach((player) => {
				if(players[player.playerId] != undefined){
					const input = players[player.playerId].input;

					player.setVelocityX(0);
					player.setVelocityY(0);
					if (!(input.left || input.right || input.up || input.down)) {
						player.setVelocityX(0);
						player.setVelocityY(0);
					}else{
						if (input.up) {
							player.setVelocityY(-3);
							player.direction = 'up';
						} else if (input.down) {
							player.setVelocityY(3);
							player.direction = 'down';
						}
						if (input.left) {
							player.setVelocityX(-3);
							player.direction = 'left';
						} else if (input.right) {
							player.setVelocityX(3);
							player.direction = 'right';
						}
					}
					
					players[player.playerId].x = player.x;
					players[player.playerId].y = player.y;
					players[player.playerId].direction = player.direction;	
					players[player.playerId].state = input.state;	
				}
			});
			console.log(players);
			io.in(window.roomId).emit('playerUpdates', players);
		}
	}

});

