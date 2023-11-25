// player.ts
//random change

import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    console.log("Scene:", scene);
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.cursors = scene.input?.keyboard?.createCursorKeys() ?? {} as Phaser.Types.Input.Keyboard.CursorKeys;
  }

  update() {
    this.handleInput();
  }

  private handleInput() {
    const speed = 500;

    if (this.cursors.up?.isDown) {
      this.setVelocity(0, -speed);
    } else if (this.cursors.down?.isDown) {
      this.setVelocity(0, speed);
    } else {
      this.setVelocity(0, 0);
    }

    if (this.cursors.left?.isDown) {
      this.setVelocityX(-speed);
    } else if (this.cursors.right?.isDown) {
      this.setVelocityX(speed);
    } else {
      this.setVelocityX(0);
    }
  }
}

// export default class Player extends TileObject {
//     override takeTurn() {
//       console.log("player take turn");
//     }
//   }