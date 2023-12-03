import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Crop, { CropType } from "../classes/crop";
import SaveManager from "../saves/save-manager";
import { gameConfig } from "../main";
// import { Engine } from "matter";
//import TileObject from "../classes/tile-object";

// test basic functionality
//random change

export class Test extends Phaser.Scene {
  grid: Grid;
  player!: Player;
  private playerPrevPosition: Phaser.Math.Vector2;
  harvestedText: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text;
  sunLevelText: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text;
  sunLevelBar: Phaser.GameObjects.Graphics = {} as Phaser.GameObjects.Graphics;
  moistureText: Phaser.GameObjects.Text = {} as Phaser.GameObjects.Text;
  moistureLevelBar: Phaser.GameObjects.Graphics =
    {} as Phaser.GameObjects.Graphics;

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
    if (gameConfig.hebrew) {
      this.load.image("undoButton", "buttons/undoButtonHebrew.png");
      this.load.image("redoButton", "buttons/redoButtonHebrew.png");
      this.load.image("saveButton", "buttons/saveButtonHebrew.png");
    } else if (gameConfig.chinese) {
        this.load.image("undoButton", "buttons/undoButtonChinese.png");
        this.load.image("redoButton", "buttons/redoButtonChinese.png");
        this.load.image("saveButton", "buttons/saveButtonChinese.png");
    } else {
      this.load.image("undoButton", "buttons/undoButton.png");
      this.load.image("redoButton", "buttons/redoButton.png");
      this.load.image("saveButton", "buttons/saveButton.png");
    }
  }

  static mouseX: number;
  static mouseY: number;

  create() {
    let cropType = CropType.purple;

    const undoButton = this.add.image(1175, 115, "undoButton").setInteractive();
    undoButton.setScale(3.4);
    undoButton
      .on("pointerdown", () => {
        console.log("undo Button Clicked");
        SaveManager.undo();
      })
      .setDepth(1);

    const redoButton = this.add.image(1175, 180, "redoButton").setInteractive();
    redoButton.setScale(3.4);
    redoButton
      .on("pointerdown", () => {
        console.log("redo Button Clicked");
        SaveManager.redo();
      })
      .setDepth(1);

    const saveButton = this.add.image(1175, 245, "saveButton").setInteractive();
    saveButton.setScale(3.4);
    saveButton
      .on("pointerdown", () => {
        console.log("save Button Clicked");
        SaveManager.save();
      })
      .setDepth(1);

    const redButton = this.add.image(1240, 50, "redButton").setInteractive();
    redButton.setScale(3);
    redButton
      .on("pointerdown", () => {
        console.log("red Button Clicked");
        cropType = CropType.red;
      })
      .setDepth(1);

    const greenButton = this.add
      .image(1175, 50, "greenButton")
      .setInteractive();
    greenButton.setScale(3);
    greenButton
      .on("pointerdown", () => {
        console.log("Green Button Clicked");
        cropType = CropType.green;
      })
      .setDepth(1);

    const purpleButton = this.add
      .image(1110, 50, "purpleButton")
      .setInteractive();
    purpleButton.setScale(3);
    purpleButton
      .on("pointerdown", () => {
        console.log("Purple Button Clicked");
        cropType = CropType.purple;
      })
      .setDepth(1);

    this.harvestedText = this.add
      .text(10, 10, "", {
        fontFamily: "Arial",
        fontSize: 40,
        color: "#ffffff",
      })
      .setDepth(1);

    this.sunLevelText = this.add
      .text(
        this.game.canvas.width / 2,
        40,
        `Sun Level: ${Grid.sunLevel.toFixed(2)}`,
        {
          fontFamily: "Arial",
          fontSize: 50,
          color: "#ffffff",
        }
      )
      .setOrigin(0.5)
      .setDepth(1);

    this.sunLevelBar = this.add
      .graphics({
        x: this.game.canvas.width / 2 - 100,
        y: 80,
        fillStyle: { color: 0xffff00 },
      })
      .setDepth(1);

    this.moistureText = this.add
      .text(20, this.game.canvas.height - 75, "", {
        fontFamily: "Arial",
        fontSize: 50,
        color: "#ffffff",
      })
      .setDepth(2)
      .setOrigin(0);

    this.moistureLevelBar = this.add
      .graphics({
        x: 40,
        y: this.game.canvas.height - 125,
        fillStyle: { color: 0x0000ff },
      })
      .setDepth(1);

    Grid.drawTiles();
    this.player = new Player(this, 100, 100, "blue");
    this.player.setScale(4);
    this.physics.world.setBounds(0, 0, gridConfig.width, gridConfig.height);
    this.physics.world.enable(this.player);

    // plant where mouse is clicked
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const row = Math.floor(pointer.y / Grid.tileHeight);
      const col = Math.floor(pointer.x / Grid.tileWidth);

      const tile = Grid.getTile({ row, col });

      const distanceToPlayer = Phaser.Math.Distance.Between(
        pointer.x,
        pointer.y,
        this.player.x,
        this.player.y
      );

      if (distanceToPlayer <= 150) {
        if (tile.length === 0) {
          // Plant functionality
          // const cropType = CropType.purple; // You may want to change this based on your logic
          Crop.plantCrop(this, cropType, pointer.x, pointer.y);
        } else {
          // Existing pointerdown functionality for eating crops
          const distanceToPlayer = Phaser.Math.Distance.BetweenPoints(
            new Phaser.Math.Vector2(pointer.x, pointer.y),
            this.player
          );

          if (distanceToPlayer <= 150 && tile[0] instanceof Crop) {
            const obj = Grid.getTileObject({ row, col }) as Crop;
            obj?.eat();
          }
        }
      }

      // Display moisture level for the clicked tile
      this.displayMoistureLevel(row, col);
    });


    // Save Manager Init
    SaveManager.setPlayer(this.player);
    SaveManager.setScene(this);
    SaveManager.loadCurTurn();
    SaveManager.load();
  }

  displayMoistureLevel(row: number, col: number) {
    const tile = Grid.getTile({ row, col });

    if (tile.length > 0 && tile[0] instanceof Crop) {
      const crop = Grid.getTileObject({ row, col }) as Crop;
      const moistureLevel = crop.getMoistureLevel();
      this.moistureText.setText(`Moisture: ${moistureLevel.toFixed(2)}`);

      const barWidth = Phaser.Math.Linear(0, 100, moistureLevel);
      this.moistureLevelBar.clear().fillRect(0, 0, barWidth, 20);
    } else {
      this.moistureText.setText("");
      this.moistureLevelBar.clear();
    }
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

    this.harvestedText.setText(`Harvested: ${Crop.consumed}`);
    this.sunLevelText.setText(`Sun Level: ${Grid.sunLevel.toFixed(2)}`);

    // Update the width of the bar based on sun level
    const barWidth = Phaser.Math.Linear(0, 200, Grid.sunLevel);
    this.sunLevelBar.clear().fillRect(0, 0, barWidth, 20);

    // WIN CONDITION
    if (Crop.consumed >= 30) {
      this.add
        .text(
          this.game.canvas.width / 2,
          this.game.canvas.height / 2,
          "You Win!",
          {
            fontFamily: "Arial",
            fontSize: 60,
            color: "#00ff00",
          }
        )
        .setOrigin(0.5);
    }

    const thresholdPixelsWalked = 300;

    if (distanceMoved > thresholdPixelsWalked) {
      // if placed crop can grow and pixelWalked requirement met, evolve
      if (distanceMoved > thresholdPixelsWalked) {
        this.updatePlayerPrevPosition(); // turn-based evolution system
        console.log("satisfied");
        // SaveManager.save(); //autosave

        Grid.nextTurn(); // all objects on grid take their turns
        SaveManager.save();
      }
    }
  }
}
