import React, { useEffect, useRef, useState } from "react";
import Phaser from "phaser";
import MainScene from "./scenes/MainScene";
import WebFont from "webfontloader";
import GameOverScene from "./scenes/GameOverScene";
import StartScene from "./scenes/StartScene";
import { useGameSettingsStore } from "../stores/useGameSettingsStore";
import { useGameOverModalStore } from "../stores/useGameOverModalStore";
import WinningScene from "./scenes/WinningScene";

const PhaserGameComponent: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const { snakeBodyImage, appleImage, bombImage } = useGameSettingsStore();
  const [currentSnakeBodyImage, setCurrentSnakeBodyImage] =
    useState<string>(snakeBodyImage);
  const [currentAppleImage, setCurrentAppleImage] =
    useState<string>(appleImage);
  const [currentBombImage, setCurrentBombImage] = useState<string>(bombImage);
  const { showGameOverModal } = useGameOverModalStore();

  const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64.split(",")[1]);
    const byteArrays: Uint8Array[] = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length)
        .fill(0)
        .map((_, i) => slice.charCodeAt(i));
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    return new Blob(byteArrays, { type: mimeType });
  };

  useEffect(() => {
    WebFont.load({
      google: { families: ["Montserrat:100,200,300,400,500,600,700,800,900"] },
      active: () => {
        const config: Phaser.Types.Core.GameConfig = {
          type: Phaser.AUTO,
          parent: "phaser-game",
          width: 360,
          height: 360,
          backgroundColor: "#ababab",
          physics: {
            default: "arcade",
            arcade: { debug: false },
          },
          scene: [
            StartScene,
            new MainScene(
              currentAppleImage,
              currentBombImage,
              currentSnakeBodyImage
            ),
            GameOverScene,
            WinningScene,
          ],
        };

        gameRef.current = new Phaser.Game(config);
      },
    });

    return () => gameRef.current?.destroy(true);
  }, [currentAppleImage, currentBombImage, currentSnakeBodyImage]);

  useEffect(() => {
    if (appleImage && appleImage !== "/assets/apple.png") {
      const appleBlob = base64ToBlob(appleImage, "image/png");
      setCurrentAppleImage(URL.createObjectURL(appleBlob));
    }
  }, [appleImage]);

  useEffect(() => {
    if (bombImage && bombImage !== "/assets/bomb.png") {
      const bombBlob = base64ToBlob(bombImage, "image/png");
      setCurrentBombImage(URL.createObjectURL(bombBlob));
    }
  }, [bombImage]);

  useEffect(() => {
    if (snakeBodyImage && snakeBodyImage !== "/assets/snakebody.png") {
      const snakeBodyBlob = base64ToBlob(snakeBodyImage, "image/png");
      setCurrentSnakeBodyImage(URL.createObjectURL(snakeBodyBlob));
    }
  }, [snakeBodyImage]);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.events.emit("toggleRestartButton", !showGameOverModal);
    }
  }, [showGameOverModal]);

  return <div id="phaser-game" className="border-2 border-white"></div>;
};

export default PhaserGameComponent;
