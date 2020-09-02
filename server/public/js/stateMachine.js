class StateMachine {
    constructor(initialState, possibleStates, stateArgs = []) {
        this.initialState = initialState;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;

        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }
    }

    step() {
        // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }

        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }

    transition(newState, ...enterArgs) {
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
}

class State {
    enter() {

    }

    execute() {

    }
}

class IdleState extends State {
    enter(scene, container, player) {
        container.setVelocity(0);
        player.anims.play(`walk-${player.direction? player.direction : 'down'}-Personaje`);
        player.moving = false;
        player.anims.stop();
    }

    execute(scene, container, player) {
        const { left, right, up, down, space, shift } = scene.cursors;


        // Transition to move if pressing a movement key
        if (left.isDown || right.isDown || up.isDown || down.isDown) {
            this.stateMachine.transition('move');
            return;
        }
    }
}

class MoveState extends State {
    execute(scene, container, player) {
        const { left, right, up, down, space, shift } = scene.cursors;

        if (up.isDown) {
            player.direction = 'up';
        } else if (down.isDown) {
            player.direction = 'down';
        }
        if (left.isDown) {
            player.direction = 'left';
        } else if (right.isDown) {
            player.direction = 'right';
        }


        player.moving = true;            
        player.anims.play(`walk-${player.direction}-Personaje`, true);

        if (left.isDown !== scene.leftKeyPressed || right.isDown !== scene.rightKeyPressed || up.isDown !== scene.upKeyPressed || down.isDown !== scene.downKeyPressed) {
            scene.leftKeyPressed = left.isDown;
            scene.rightKeyPressed = right.isDown;
            scene.upKeyPressed = up.isDown;
            scene.downKeyPressed = down.isDown;
        } else {
            if (!(left.isDown || right.isDown || up.isDown || down.isDown)) {
                this.stateMachine.transition('idle');
                return;
            }
        }
    }
}

class SwingState extends State {
    enter(scene, container, player) {
        switch (player.direction) {
            case 'right':
                container.setVelocityX(2);
                break;
            case 'left':
                container.setVelocityX(-2);
                break;
            case 'down':
                container.setVelocityY(2);
                break;
            case 'up':
                container.setVelocityY(-2);
                break;
        }
        player.anims.play(`swing-${player.direction}-${actual_user.name}`);
        player.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            this.stateMachine.transition('idle');
        });
    }
}

class PushedState extends State {
    enter(scene, container, player) {
        switch (player.attacked) {
            case 'right':
                container.setVelocityX(-1);
                break;
            case 'left':
                container.setVelocityX(1);
                break;
            case 'down':
                container.setVelocityY(-1);
                break;
            case 'up':
                container.setVelocityY(1);
                break;
        }
        player.anims.play(`pushed-${player.direction}-${actual_user.name}`);
        player.once(Phaser.Animations.Events.SPRITE_ANIMATION_COMPLETE, () => {
            this.stateMachine.transition('idle');
        });
    }
}
