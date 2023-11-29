import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Crop, { CropType } from "../classes/crop";
//import TileObject from "../classes/tile-object";

// test basic functionality
//random change

export class Test extends Phaser.Scene {
  grid: Grid;
  player!: Player;
  private playerPrevPosition: Phaser.Math.Vector2;
  harvestedText: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text;

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
    this.load.image("green2", "plants/greenlevel2.png");
    this.load.image("green3", "plants/greenlevel3.png");
    this.load.image("purple1", "plants/purplelevel1.png");
    this.load.image("purple2", "plants/purplelevel2.png");
    this.load.image("purple3", "plants/purplelevel3.png");
    this.load.image("red1", "plants/redlevel1.png");
    this.load.image("red2", "plants/redlevel2.png");
    this.load.image("red3", "plants/redlevel3.png");
    this.load.image("redButton", "buttons/redButton.png");
    this.load.image("greenButton", "buttons/greenButton.png");
    this.load.image("purpleButton", "buttons/purpleButton.png");
  }

  static mouseX: number;
  static mouseY: number;

  create() {

    let cropType = CropType.purple;

    const redButton = this.add.image(1200, 50, 'redButton').setInteractive();
    redButton.setScale(3);
    redButton.on('pointerdown', () => {
        console.log('red Button Clicked');
        cropType = CropType.red;
    }).setDepth(1);

    const greenButton = this.add.image(1135, 50, 'greenButton').setInteractive();
    greenButton.setScale(3);
    greenButton.on('pointerdown', () => {
        console.log('Green Button Clicked');
        cropType = CropType.green;
    }).setDepth(1);

    const purpleButton = this.add.image(1070, 50, 'purpleButton').setInteractive();
    purpleButton.setScale(3);
    purpleButton.on('pointerdown', () => {
        console.log('Purple Button Clicked');
        cropType = CropType.purple;
    }).setDepth(1);

    this.harvestedText = this.add.text(10, 10, "Harvested: 0", {
      fontFamily: "Arial",
      fontSize: 40,
      color: "#ffffff",
    }).setDepth(1);

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
      const distanceToPlayer = Phaser.Math.Distance.BetweenPoints(
        clickedPosition,
        this.player
      );

      if (distanceToPlayer <= 150 ) {
          if (Grid.getTile({ row, col }).length === 0) {
            const plant = Crop.plantCrop(this, cropType, Test.mouseX, Test.mouseY);
            plant.takeTurn();
          } else {
            const obj = Grid.getTileObject({row, col}) as Crop;
            obj?.eat();
          }
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
      this.playerPrevPosition.y
    );

    const thresholdPixelsWalked = 300;

    if (distanceMoved > thresholdPixelsWalked) {
      // if placed crop can grow and pixelWalked requirement met, evolve
      if (distanceMoved > thresholdPixelsWalked) {
        this.updatePlayerPrevPosition(); // turn-based evolution system
        console.log("satisfied");

        /////////////last added but incomplete//////////////
        Grid.nextTurn(); // all objects on grid take their turns
      }
    }
  }
}
