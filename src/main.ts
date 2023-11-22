import Phaser from "phaser";
import { Test } from "./scenes/test-level";

const game = new Phaser.Game({
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 1280
  },
  pixelArt: true,
  backgroundColor: 0x0000ff,
  scene: [Test],
  title: "121 Final"
});

console.log(game);
