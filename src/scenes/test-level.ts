import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";

// test basic functionality
//random change

export class Test extends Phaser.Scene {
  grid: Grid;
  player!: Player;

  constructor() {
    super("Test");
    this.grid = new Grid(10, 10, 128, 128, this); //10, 10, 16, 16, this ... I multiplied by scale 8 like in drawTiles
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("dryTile", "drydirt.png");
    this.load.image("blue", "blueFront.png");
    this.load.tilemapTiledJSON("map", "farmWet.json");
    this.load.spritesheet("farmtiles", "farmtiles.png", { frameWidth: 16, frameHeight: 16 });
  }

  create() {
    Grid.drawTiles();
    this.player = new Player(this, 100, 100, "blue");
    this.player.setScale(4);
    this.physics.world.setBounds(0, 0, 1280, 1280);
    this.physics.world.enable(this.player);
  }

  update() {
    this.player.update();
  }
}
