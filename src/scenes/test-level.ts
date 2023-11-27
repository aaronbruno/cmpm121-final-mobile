import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Crop, { CropType } from "../classes/crop";

// test basic functionality
//random change

export class Test extends Phaser.Scene {
  grid: Grid;
  player!: Player;
  private playerPrevPosition: Phaser.Math.Vector2;

  constructor() {
    super("Test");
    this.playerPrevPosition = new Phaser.Math.Vector2(0, 0);
    this.grid = new Grid(
      gridConfig.columns,
      gridConfig.rows,
      gridConfig.tileWidth,
      gridConfig.tileHeight,
      this
    ); //10, 10, 16, 16, this ... I multiplied by scale 8 like in drawTiles
  }

  preload() {
    this.load.path = "assets/";
    this.load.image("dryTile", "terrain/drydirt.png");
    this.load.image("blue", "characters/blueFront.png");
    this.load.tilemapTiledJSON("map", "terrain/farmWet.json");
    this.load.spritesheet("farmtiles", "terrain/farmtiles.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("green1", "plants/greenlevel1.png");
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
    this.input.on("pointermove", (pointer: { x: number; y: number }) => {
      Test.mouseX = pointer.x;
      Test.mouseY = pointer.y;
    });
    this.input.on("pointerdown", () => {
      const row = Math.floor(Test.mouseY / Grid.tileHeight);
      const col = Math.floor(Test.mouseX / Grid.tileWidth);
      if (Grid.getTile({ row: row, col: col }).length > 0) {
        console.log("already here");
        return;
      }
      const plant = new Crop(CropType.green, 10, {
        scene: this,
        name: "plant",
        spriteName: "green1",
        row: row,
        col: col,
      });
      console.log(plant);
      plant.takeTurn();
    });
  }

  updatePlayerPrevPosition() {
    this.playerPrevPosition.x = this.player.x;
    this.playerPrevPosition.y = this.player.y;
  }

  update() {
    this.player.update();

    /////////////last added but incomplete//////////////
    const distanceMoved = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.playerPrevPosition.x,
      this.playerPrevPosition.y,
    );

    const thresholdPixelsWalked = 300;

    if (distanceMoved > thresholdPixelsWalked) {
      // if placed crop can grow and pixelWalked requirement met, evolve
      if (distanceMoved >= thresholdPixelsWalked) {
        this.updatePlayerPrevPosition(); //turn based evolution system
        console.log("satisfied");

        // this.grid.forEachTile((tile: Tile) => {
        // //if plant on tile
        //   const plant = tile.getObjectByName("plant") as Crop;
        //   if (plant && plant.level < 2) {
        //     // Update the plant to the next level
        //     plant.takeTurn();
        //     // //change plant image to next level
        //     // const newSpriteKey = `greenlevel${plant.level}`;
        //     // // Load the new sprite for the plant
        //     // plant.setTexture(newSpriteKey);
        //   }
        // });
      }
    }
  }
}
