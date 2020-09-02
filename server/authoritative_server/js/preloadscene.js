var PreloadScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function StageScene() {
            Phaser.Scene.call(this, { key: 'preloader' });
        },

    preload: function () {
        this.load.image("tiles3", "assets/img/in tento final2.png");
        this.load.tilemapTiledJSON("map", "assets/json/meetRoom.json");
        this.load.spritesheet('Personaje', "assets/sprite/1598653587228-game-sprite.png", {
            frameWidth: 80,
            frameHeight: 80
        });
        //this.load.audio('stageSound', '/assets/audio/index.wav');

    },

    create: function () {
        this.scene.start('stage');
     }
});