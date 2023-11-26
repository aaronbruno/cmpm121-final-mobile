import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Plant, { PlantType } from "../classes/plant";

// test basic functionality
//random change

export class Test extends Phaser.Scene {
  grid: Grid;
  player!: Player;

  constructor() {
    super("Test");
    this.grid = new Grid(gridConfig.columns, gridConfig.rows, gridConfig.tileWidth, gridConfig.tileHeight, this); //10, 10, 16, 16, this ... I multiplied by scale 8 like in drawTiles
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("dryTile", "terrain/drydirt.png");
    this.load.image("blue", "characters/blueFront.png");
    this.load.tilemapTiledJSON("map", "terrain/farmWet.json");
    this.load.spritesheet("farmtiles", "terrain/farmtiles.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("green1", "plants/greenlevel3.png");
  }

  static mouseX: number;
  static mouseY: number;

  create() {
    Grid.drawTiles();
    this.player = new Player(this, 100, 100, "blue");
    this.player.setScale(4);
    this.physics.world.setBounds(0, 0, gridConfig.width, gridConfig.height);
    this.physics.world.enable(this.player);

    // plant where mouse is clicked
    this.input.on("pointermove", (pointer: {x: number, y: number}) => {
      Test.mouseX = pointer.x;
      Test.mouseY = pointer.y;
    });
    this.input.on("pointerdown", () => {
      const row = Math.floor(Test.mouseY / Grid.tileHeight);
      const col = Math.floor(Test.mouseX / Grid.tileWidth);
      if (Grid.getTile({row: row, col: col}).length > 0) {
        console.log("already here");
        return;
      }
      const plant = new Plant(PlantType.green, 10, {
        scene: this,
        name: "plant",
        spriteName: "green1",
        row: row,
        col: col
      });
      console.log(plant);
      plant.takeTurn();
    });

  }

  update() {
    this.player.update();

  }
}
