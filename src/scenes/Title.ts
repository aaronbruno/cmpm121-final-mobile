import Phaser from "phaser";
import { gameConfig } from "../main";
import SaveManager from "../saves/save-manager";
import { gridConfig } from "../grid-config";

export class Title extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  preload() {
    this.load.path = "assets/";
  }

  createInteractiveText(
    x: number,
    y: number,
    text: string | string[],
    style: Phaser.Types.GameObjects.Text.TextStyle | undefined
  ) {
    const interactiveText = this.add.text(x, y, text, style);
    interactiveText.setInteractive();
    interactiveText.on("pointerover", () => {
      interactiveText.setStyle({ fill: "#ff0" });
    });
    interactiveText.on("pointerout", () => {
      interactiveText.setStyle({ fill: "#fff" });
    });

    return interactiveText;
  }

  create() {
    gameConfig.chinese = false;
    gameConfig.hebrew = false;
    gameConfig.english = true;

    this.cameras.main.setBackgroundColor("#e75480");

    const playText = this.createInteractiveText(gridConfig.width / 2, 300, "CONTINUE", {
      fontSize: "100px",
    });
    playText.on("pointerdown", () => {
      this.scene.start("Test");
    });

    const newGameText = this.createInteractiveText(gridConfig.width / 2, 600, "NEW GAME", {
      fontSize: "100px",
    });
    newGameText.on("pointerdown", () => {
      SaveManager.clear();
      this.scene.start("Test");
    });

    this.add.text(100, 800, "Language:", { fontSize: "50px" });

    const chineseText = this.createInteractiveText(430, 800, "Chinese", {
      fontSize: "50px",
    });
    chineseText.on("pointerdown", () => {
      gameConfig.chinese = true;
      gameConfig.hebrew = false;
      gameConfig.english = false;
    });

    const englishText = this.createInteractiveText(930, 800, "English", {
      fontSize: "50px",
    });
    englishText.on("pointerdown", () => {
      gameConfig.chinese = false;
      gameConfig.hebrew = false;
      gameConfig.english = true;
    });

    const hebrewText = this.createInteractiveText(700, 800, "Hebrew", {
      fontSize: "50px",
    });
    hebrewText.on("pointerdown", () => {
      gameConfig.chinese = false;
      gameConfig.hebrew = true;
      gameConfig.english = false;
    });
  }
}
