import Phaser from "phaser";
import Player from "../classes/player";
import Grid from "../classes/grid";
import { gridConfig } from "../grid-config";
import Crop, { CropType } from "../classes/crop";
import SaveManager from "../saves/save-manager";
import { gameConfig } from "../main";
import Button from "../classes/button";
// import { Engine } from "matter";
//import TileObject from "../classes/tile-object";
import * as Urls from "../import-assets";

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
    //this.load.path = "assets/";
    this.load.image("dryTile", Urls.dryDirt as string);
    this.load.image("blue", Urls.blueFront as string);
    this.load.tilemapTiledJSON("map", Urls.farmWet);
    this.load.spritesheet("farmtiles", Urls.farmTiles as string, {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("green1", Urls.greenLevel1 as string);
    this.load.image("green2", Urls.greenLevel2 as string);
    this.load.image("green3", Urls.greenLevel3 as string);
    this.load.image("purple1", Urls.purpleLevel1 as string);
    this.load.image("purple2", Urls.purpleLevel2 as string);
    this.load.image("purple3", Urls.purpleLevel3 as string);
    this.load.image("red1", Urls.redLevel1 as string);
    this.load.image("red2", Urls.redLevel2 as string);
    this.load.image("red3", Urls.redLevel3 as string);
    this.load.image("redButton", Urls.redButton as string);
    this.load.image("greenButton", Urls.greenButton as string);
    this.load.image("purpleButton", Urls.purpleButton as string);
    if (gameConfig?.hebrew) {
      this.load.image("undoButton", Urls.undoButtonHebrew as string);
      this.load.image("redoButton", Urls.redoButtonHebrew as string);
      this.load.image("saveButton", Urls.saveButtonHebrew as string);
    } else if (gameConfig.chinese) {
      this.load.image("undoButton", Urls.undoButtonChinese as string);
      this.load.image("redoButton", Urls.redoButtonChinese as string);
      this.load.image("saveButton", Urls.saveButtonChinese as string);
    } else {
      this.load.image("undoButton", Urls.undoButton as string);
      this.load.image("redoButton", Urls.redoButton as string);
      this.load.image("saveButton", Urls.saveButton as string);
    }
  }

  static mouseX: number;
  static mouseY: number;

  create() {
    let cropType = CropType.purple;

    // undo button
    new Button({
      scene: this,
      x: 1175,
      y: 115,
      texture: "undoButton",
      clickAction: () => {
        console.log("undo Button Clicked");
        SaveManager.undo();
        this.updatePlayerPrevPosition();
      },
    });

    // redo button
    new Button({
      scene: this,
      x: 1175,
      y: 180,
      texture: "redoButton",
      clickAction: () => {
        console.log("redo Button Clicked");
        SaveManager.redo();
        this.updatePlayerPrevPosition();
      },
    });

    // save button
    new Button({
      scene: this,
      x: 1175,
      y: 245,
      texture: "saveButton",
      clickAction: () => {
        console.log("save Button Clicked");
        const file = prompt("Save File Name");
        // Change this later to handle no input
        SaveManager.saveToFile(file!);
      },
    });

    this.input.keyboard?.on("keydown-L", () => {
      const file = prompt("Load File Name");
      // Change this later to handle no input
      SaveManager.loadFromFile(file!);
    });

    // red button
    new Button({
      scene: this,
      x: 1240,
      y: 50,
      texture: "redButton",
      scale: 3,
      clickAction: () => {
        console.log("red Button Clicked");
        cropType = CropType.red;
      },
    });

    // green button
    new Button({
      scene: this,
      x: 1175,
      y: 50,
      texture: "greenButton",
      scale: 3,
      clickAction: () => {
        console.log("Green Button Clicked");
        cropType = CropType.green;
      },
    });

    // purple button
    new Button({
      scene: this,
      x: 1110,
      y: 50,
      texture: "purpleButton",
      scale: 3,
      clickAction: () => {
        console.log("Purple Button Clicked");
        cropType = CropType.purple;
      },
    });

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
          SaveManager.save();
        } else {
          // Existing pointerdown functionality for eating crops
          const distanceToPlayer = Phaser.Math.Distance.BetweenPoints(
            new Phaser.Math.Vector2(pointer.x, pointer.y),
            this.player
          );

          if (distanceToPlayer <= 150 && tile[0] instanceof Crop) {
            const obj = Grid.getTileObject({ row, col }) as Crop;
            if (obj) {
              obj.eat();
              SaveManager.save();
            }
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
    SaveManager.save(); // init original turn
  }

  displayMoistureLevel(row: number, col: number) {
    const tile = Grid.getTile({ row, col });

    if (tile.length > 0 && tile[0] instanceof Crop) {
      const crop = Grid.getTileObject({ row, col }) as Crop;
      const moistureLevel = crop.getMoistureLevel();
      if (gameConfig.chinese) {
        this.moistureText.setText(`水分: ${moistureLevel.toFixed(2)}`);
      } else if (gameConfig.hebrew) {
        this.moistureText.setText(`לַחוּת: ${moistureLevel.toFixed(2)}`);
      } else {
        this.moistureText.setText(`Moisture: ${moistureLevel.toFixed(2)}`);
      }

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

    if (gameConfig.chinese) {
      this.harvestedText.setText(`收获的: ${Crop.consumed}`);
      this.sunLevelText.setText(`太阳高度: ${Grid.sunLevel.toFixed(2)}`);
    } else if (gameConfig.hebrew) {
      this.harvestedText.setText(`בָּצוּר: ${Crop.consumed}`);
      this.sunLevelText.setText(`מפלס השמש: ${Grid.sunLevel.toFixed(2)}`);
    } else {
      this.harvestedText.setText(`Harvested: ${Crop.consumed}`);
      this.sunLevelText.setText(`Sun Level: ${Grid.sunLevel.toFixed(2)}`);
    }

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
