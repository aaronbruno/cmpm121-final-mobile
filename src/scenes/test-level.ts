import Phaser from "phaser";
import Grid from "../classes/grid";

// test basic functionality

export class Test extends Phaser.Scene {
  grid: Grid;

  constructor() {
    super("Test");
    this.grid = new Grid(10, 10, 128, 128, this); //10, 10, 16, 16, this ... I multiplied by scale 8 like in drawTiles
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("dryTile", "drydirt.png");
    this.load.tilemapTiledJSON("map", "farmWet.json");
    this.load.spritesheet("farmtiles", "farmtiles.png", { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    Grid.drawTiles();
  }
}
