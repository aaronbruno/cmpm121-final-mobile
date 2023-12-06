import Phaser from "phaser";

export interface ButtonConfig {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string;
  scale?: number;
  clickAction: () => void;
}

export default class Button {
  readonly scene: Phaser.Scene;
  sprite: Phaser.GameObjects.Image;

  constructor(config: ButtonConfig) {
    this.scene = config.scene;
    this.sprite = this.scene.add.image(config.x, config.y, config.texture);
    this.sprite
      .setScale(config.scale ? config.scale : 3.4)
      .setDepth(1)
      .setInteractive()
      .on("pointerdown", config.clickAction);
  }
}
