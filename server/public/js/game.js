var config = {
  type: Phaser.AUTO,
  parent: 'phaser-example',
  width: window.innerWidth,
  height: window.innerHeight,
  pixelArt: true,
  roundPixels: true,
  dom: {
	  createContainer: true
  },
  physics: {
	  default: 'matter',
	  matter: {
		  //debug: true,
		  gravity: { x: 0, y: 0 },
	  }
  },
  scene: [PreloadScene, StageScene]
};

var game = new Phaser.Game(config);