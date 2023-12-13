import Phaser from "phaser";
import { gameConfig } from "../main";
import SaveManager from "../saves/save-manager";
import { gridConfig } from "../grid-config";

export class Title extends Phaser.Scene {
  private continueText!: Phaser.GameObjects.Text;
  private newGameText!: Phaser.GameObjects.Text;
  private languageText!: Phaser.GameObjects.Text;
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

  updateTextBasedOnLanguage() {
    const continueText = gameConfig.chinese ? "继续" : (gameConfig.hebrew ? "המשך" : "CONTINUE");
    const newGameText = gameConfig.chinese ? "新游戏" : (gameConfig.hebrew ? "משחק חדש" : "NEW GAME");
    const languageText = gameConfig.chinese ? "语言：" : (gameConfig.hebrew ? "שפה:" : "Language:");

    this.continueText.setText(continueText);
    this.newGameText.setText(newGameText);
    this.languageText.setText(languageText);
  }

  create() {
    gameConfig.chinese = false;
    gameConfig.hebrew = false;
    gameConfig.english = true;

    this.cameras.main.setBackgroundColor("#e75480");

    this.continueText = this.createInteractiveText(gridConfig.width / 2, 300, "CONTINUE", {
      fontSize: "100px",
    });
    this.continueText.on("pointerdown", () => {
      this.scene.start("Test");
    });

    this.newGameText = this.createInteractiveText(gridConfig.width / 2, 600, "NEW GAME", {
      fontSize: "100px",
    });
    this.newGameText.on("pointerdown", () => {
      SaveManager.clear();
      this.scene.start("Test");
    });

    this.languageText = this.add.text(100, 800, "Language:", { fontSize: "50px" });

    const chineseText = this.createInteractiveText(430, 800, "中文", {
      fontSize: "50px",
    });
    chineseText.on("pointerdown", () => {
      gameConfig.chinese = true;
      gameConfig.hebrew = false;
      gameConfig.english = false;
      this.updateTextBasedOnLanguage();
    });

    const englishText = this.createInteractiveText(830, 800, "English", {
      fontSize: "50px",
    });
    englishText.on("pointerdown", () => {
      gameConfig.chinese = false;
      gameConfig.hebrew = false;
      gameConfig.english = true;
      this.updateTextBasedOnLanguage();
    });

    const hebrewText = this.createInteractiveText(600, 800, "עברית", {
      fontSize: "50px",
    });
    hebrewText.on("pointerdown", () => {
      gameConfig.chinese = false;
      gameConfig.hebrew = true;
      gameConfig.english = false;
      this.updateTextBasedOnLanguage();
    });

    this.updateTextBasedOnLanguage();
  }
}