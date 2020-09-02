var StageScene = new Phaser.Class({

	Extends: Phaser.Scene,

	initialize:

		function StageScene() {
			Phaser.Scene.call(this, { key: 'stage' });
		},

	create: function () {

		//window.MyScene = this;

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

		this.players = []

		this.createAnimations(self, 'Personaje');
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

		//this.socket = appSocket.stage(self, userId, roomId, user);
		//this.background = this.sound.add('stageSound');
		//showRules();
		//this.background.play();

		var self = this;
		this.socket = io();
        this.socket.emit('join',window.location.href.split('/')[4]);

		this.socket.on('currentPlayers', function (players) {
			Object.keys(players).forEach(function (id) {
				if (players[id].playerId === self.socket.id) {
					displayPlayers(self, players[id], 'own');
				} else {
					displayPlayers(self, players[id], 'otherPlayer');
				}
			});
		});

		this.socket.on('newPlayer', function (playerInfo) {
			displayPlayers(self, playerInfo, 'otherPlayer');
		});

		this.socket.on('disconnect', function (playerId) {
			self.players.forEach(function (player) {
				if (playerId === player.playerId) {
					player.destroy();
				}
			});
		});

		this.cursors = this.input.keyboard.createCursorKeys();
		this.socket.on('playerUpdates', function (players) {
			Object.keys(players).forEach(function (id) {
				self.players.forEach(function (player) {
					if (players[id].playerId === player.playerId) {
						if(self.socket.id == player.playerId ){
							player.x = players[id].x
							player.y = players[id].y
							player.getByName('player').direction = players[id].direction
						}else{
							player.x = players[id].x;
							player.y = players[id].y;
							console.log(players[id].state);
							switch (players[id].state) {
								case 'idle':
									player.getByName('player').anims.play(`walk-${players[id].direction}-Personaje`, true);
									player.getByName('player').anims.stop();
									break;
								case 'move':
									player.getByName('player').anims.play(`walk-${players[id].direction}-Personaje`, true);
									break;
								case 'swing':
									player.getByName('player').anims.play(`swing-${players[id].direction}-Personaje`, true);
									break;
								case 'pushed':
									player.getByName('player').anims.play(`pushed-${players[id].direction}-Personaje`, true);
									break;
							}
						}
					}
				});
			});
		});
		this.leftKeyPressed = false;
		this.rightKeyPressed = false;
		this.upKeyPressed = false;
		this.downKeyPressed = false;

	},

	createAnimations: function (self, playerName) {
		self.anims.create({
			key: `walk-down-${playerName}`,
			frameRate: 8,
			repeat: -1,
			frames: self.anims.generateFrameNumbers(playerName, { start: 0, end: 3 }),
		});
		self.anims.create({
			key: `walk-right-${playerName}`,
			frameRate: 8,
			repeat: -1,
			frames: self.anims.generateFrameNumbers(playerName, { start: 4, end: 7 }),
		});
		self.anims.create({
			key: `walk-up-${playerName}`,
			frameRate: 8,
			repeat: -1,
			frames: self.anims.generateFrameNumbers(playerName, { start: 8, end: 11 }),
		});
		self.anims.create({
			key: `walk-left-${playerName}`,
			frameRate: 8,
			repeat: -1,
			frames: self.anims.generateFrameNumbers(playerName, { start: 12, end: 15 }),
		});
		self.anims.create({
			key: `swing-down-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 16, end: 19 }),
		});
		self.anims.create({
			key: `swing-up-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 20, end: 23 }),
		});
		self.anims.create({
			key: `swing-right-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 24, end: 27 }),
		});
		self.anims.create({
			key: `swing-left-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 28, end: 31 }),
		});
		self.anims.create({
			key: `pushed-down-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 33, end: 35 }),
		});
		self.anims.create({
			key: `pushed-up-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 41, end: 43 }),
		});
		self.anims.create({
			key: `pushed-right-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 37, end: 39 }),
		});
		self.anims.create({
			key: `pushed-left-${playerName}`,
			frameRate: 8,
			repeat: 0,
			frames: self.anims.generateFrameNumbers(playerName, { start: 45, end: 47 }),
		});

	},

	update: function () {
		if (this.stateMachine) {
			this.stateMachine.step();
			this.socket.emit('playerInput', { left: this.leftKeyPressed , right: this.rightKeyPressed, up: this.upKeyPressed, down: this.downKeyPressed, direction: this.player.direction, state: this.stateMachine.state});
			        
		}
	}

});


function displayPlayers(self, playerInfo, others, sprite = "Personaje") {
	let container = new Player(self, playerInfo.x, playerInfo.y, 80, 80, undefined);
	container.addPlayer(self, 80, 80, sprite, false);
	container.addText(self, 'Loquesea');
	container = self.matter.add.gameObject(container, { restitution: 0, friction: 1, inertia: Infinity, isSensor: false }).setFixedRotation();
	container.restitution = 0;
	container.playerId = playerInfo.playerId;
	container.body.collideWorldBounds = true;
	//self.aGrid.placeAtIndex(playerInfo.cell, self.container);
	if (others == 'own') {
		self.player = container.getPlayer();
		self.player.direction = playerInfo.direction;
		self.stateMachine = new StateMachine('idle', {
			idle: new IdleState(),
			move: new MoveState(),
			swing: new SwingState(),
			pushed: new PushedState()
		}, [self, container, self.player]);
	}
	self.players.push(container);
}