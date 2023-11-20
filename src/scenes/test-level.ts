import Phaser from "phaser";

// test basic functionality

export class Test extends Phaser.Scene {
  constructor() {
    super("Test");
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("floor-tile2", "floor-tile2.png");
  }

  create() {
    this.add.image(0, 0, "floor-tile2");
  }
}
