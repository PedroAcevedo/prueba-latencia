class Player extends Phaser.GameObjects.Container {

    constructor(scene, x, y, width, height, children) {
        super(scene, x, y, children);
        this.setSize(width, height);
        scene.add.existing(this);
        this.options = false;
    }


    addPlayer(scene, width, height, name, color) {
        const player = scene.add.sprite(0, 0, name).setOrigin(0.5, 0.5).setDisplaySize(width, height);
        player.direction = 'down';
        if (color) {
            player.setTint(Math.random() * 0xffffff);
        }
        player.setName('player');
        this.add(player);
    }

    addText(scene, text) {
        const label=scene.add.dom(0,-40).createFromHTML(`<name>${text}</name>`);
        this.add(label);
    }

    addGroup(scene, x, y, group) {
        var circle = scene.add.circle(x, y, 4, group);
        circle.setName('circle');
        this.add(circle);
    }

    changeGroup(group) {
        this.getByName('circle').setFillStyle(group);
    }

    showOptions(scene, html) {
        if (!this.options) {
            this.domElement = scene.add.dom(stage =='party'? -3 : -55, -( 40 + (stage =='party'? 10 : 0))).createFromHTML(html).setOrigin(0,0);
            if(stage=='party'){
                this.domElement.addListener('click');
                this.domElement.on('click', () =>{ this.hideOptions() });
            }
            this.add(this.domElement);
            this.options = true;
        } else {
            this.remove(this.domElement, true);
            this.options = false;
        }
    }


    hideOptions(){
        this.remove(this.domElement, true);
        this.options = false;
    }


    getPlayer() {
        return this.getByName('player');
    }

    // preUpdate(time, delta) {}
}

