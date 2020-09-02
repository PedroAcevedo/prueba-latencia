var players = {};
const config = {
	type: Phaser.HEADLESS,
	parent: 'phaser-example',
	width: window.innerWidth,
	height: window.innerHeight,
	dom: {
		createContainer: true
	},
	physics: {
		default: 'matter',
		matter: {
			//debug: true,
			gravity: { x: 0, y: 0 },
			plugins: {
                wrap: true,
                // ...
            }
		}
	},
	scene: [PreloadScene, StageScene]
};
window.AppConnection = {
	handlePlayerInput: function (self, playerId, input) {
		self.players.forEach((player) => {
			if (playerId === player.playerId && players[player.playerId]) {
				players[player.playerId].input = input;
			}
		});
	},
	addPlayer: function (self, playerInfo) {
		const player = self.matter.add.image(playerInfo.x, playerInfo.y, 'Personaje').setOrigin(0.5, 0.5).setDisplaySize(73, 60);
		player.playerId = playerInfo.playerId;
		self.matter.world.add(player);
		self.players.push(player);
	},
	removePlayer: function(self, playerId) {
		self.players.forEach((player) => {
			if (playerId === player.playerId) {
				delete self.players[playerId];
			}
		});
	}
}
const game = new Phaser.Game(config);
window.gameLoaded();
