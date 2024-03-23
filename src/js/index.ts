import "phaser";
import MouseScene from "./scenes/MouseScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: {
        y: 10,
      },
    },
  },
  scene: [
    MouseScene
  ],
};

window.addEventListener("load", () => new Phaser.Game(config));