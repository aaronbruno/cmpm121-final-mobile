import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Crop, { CropType } from "../classes/crop";
import TileObject from "../classes/tile-object";

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
      const clickedPosition = new Phaser.Math.Vector2(Test.mouseX, Test.mouseY);
      const distanceToPlayer = Phaser.Math.Distance.BetweenPoints(clickedPosition, this.player);
  
      if (distanceToPlayer <= 300 && Grid.getTile({ row: row, col: col }).length === 0) {
      const plant = new Crop(CropType.green, 10, {
        scene: this,
        name: "plant",
        spriteName: "green1",
        row: row,
        col: col,
      });
      console.log(plant);
      plant.takeTurn();
    }
    else {
      console.log("Cannot place plant here.");
    }
    });
  }

  updatePlayerPrevPosition() {
    this.playerPrevPosition.x = this.player.x;
    this.playerPrevPosition.y = this.player.y;
  }

  update() {
    this.player.update();

    const distanceMoved = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.playerPrevPosition.x,
      this.playerPrevPosition.y,
    );

    const thresholdPixelsWalked = 300;

    if (distanceMoved > thresholdPixelsWalked) {
      // if placed crop can grow and pixelWalked requirement met, evolve
      if (distanceMoved > thresholdPixelsWalked) {
        this.updatePlayerPrevPosition(); // turn-based evolution system
        console.log("satisfied");
    
        /////////////last added but incomplete//////////////
        this.grid.forEachTile((tile: TileObject) => {
          const isPlant = tile instanceof Crop;
          if (isPlant && tile.level < 2) {
            (tile as Crop).takeTurn();
            console.log("hi");
            //const newSpriteKey = `greenlevel${(tile as Crop).level}`;
            //tile.setTexture(newSpriteKey);
          }
        });
        // this.grid.forEachTile((tile: Tile) => {
        // //if plant on tile
        //   const plant = tile.getObjectByName("plant") as Crop;
        //   if (plant && plant.level < 2) {
        //     plant.takeTurn();
        //     // const newSpriteKey = `greenlevel${plant.level}`;
        //     // plant.setTexture(newSpriteKey);
        //   }
        // });
      }
    }
  }
}
