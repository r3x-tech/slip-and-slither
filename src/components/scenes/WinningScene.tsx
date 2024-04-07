import { useGameOverModalStore } from "../../stores/useGameOverModalStore";
import { saveHighScore } from "../../services/supabase";
import { useLoadingStore } from "../../stores/useLoadingStore";
import { useScoreStore } from "../../stores/useScoreStore";
import userStore from "../../stores/userStore";
import { useProductStatusStore } from "../../stores/useProductStatusStore";

class WinningScene extends Phaser.Scene {
  constructor() {
    super({ key: "WinningScene" });
  }

  preload() {
    // Loading the image for the button
    this.load.image("youwon", "../assets/youwon.png");
    this.load.image("playagain", "../assets/playagain.svg");
    this.load.image("savegame", "../assets/savegame.svg");
  }

  create(data: any) {
    const width = this.sys.game.config.width as number;
    const height = this.sys.game.config.height as number;

    const graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 1); // Set the color to black and fully opaque
    graphics.fillRect(
      0,
      0,
      this.sys.game.config.width as number,
      this.sys.game.config.height as number
    );

    this.add.sprite(width / 2, height / 3, "youwon");

    const restartButton = this.add.sprite(
      width / 2,
      (3 * height) / 4,
      "playagain"
    );
    restartButton.setInteractive();

    // Change cursor to pointer when hovering over the restartButton
    restartButton.on("pointerover", () => {
      this.game.canvas.style.cursor = "pointer";
    });

    // Change cursor back to default when pointer leaves the restartButton
    restartButton.on("pointerout", () => {
      this.game.canvas.style.cursor = "default";
    });

    restartButton.on("pointerdown", () => {
      this.scene.start("MainScene");
    });

    useScoreStore.getState().setScore(data.score);
    useProductStatusStore.getState().setCanPurchase(true);

    if (userStore.getState().solana_wallet_address.trim() !== "") {
      console.log();
      const saveGameButton = this.add.sprite(400, 380, "savegame");
      saveGameButton.setInteractive();

      // Change cursor to pointer when hovering over the saveGameButton
      saveGameButton.on("pointerover", () => {
        this.game.canvas.style.cursor = "pointer";
      });

      // Change cursor back to default when pointer leaves the saveGameButton
      saveGameButton.on("pointerout", () => {
        this.game.canvas.style.cursor = "default";
      });

      saveGameButton.on("pointerdown", () => {
        const currentScore = useScoreStore.getState().score;
        useLoadingStore.getState().setLoadingStatus(true);
        saveHighScore(currentScore).then(() => {
          console.log("saved score");
        });
      });
    } else {
      useGameOverModalStore.getState().setShowGameOverModal(true);
    }
  }
}

export default WinningScene;
