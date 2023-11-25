import Phaser from "phaser";
import { Test } from "./scenes/test-level";

//random change
const game = new Phaser.Game({
  type: Phaser.AUTO,
  scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 1280
  },
  physics: {
    default: "arcade",
    arcade: {
        gravity: { y: 0 },
        debug: false,
    },
},
  pixelArt: true,
  backgroundColor: 0x0000ff,
  scene: [Test],
  title: "121 Final"
});

console.log(game);
