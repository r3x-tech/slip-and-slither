import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import { generateImageFromPrompt } from "../services/imagen"; // Adjust import path as needed
import { useGameSettingsStore } from "../stores/useGameSettingsStore"; // Adjust import path as needed

interface FormData {
  aiAppleImageInput: string;
  aiBombImageInput: string;
  aiSnakeBodyImageInput: string;
}

export function Customize() {
  const [selectedAppleImage, setSelectedAppleImage] = useState<string | null>(
    null
  );
  const [selectedBombImage, setSelectedBombImage] = useState<string | null>(
    null
  );
  const [selectedSnakeBodyImage, setSelectedSnakeBodyImage] = useState<
    string | null
  >(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const {
    defaultAppleImage,
    defaultBombImage,
    defaultSnakeBodyImage,
    appleImage,
    bombImage,
    snakeBodyImage,
    setAppleImage,
    setBombImage,
    setSnakeBodyImage,
  } = useGameSettingsStore();

  const {
    handleSubmit: handleSubmitApple,
    control: controlApple,
    formState: { errors: errorsApple },
  } = useForm<FormData>();

  const {
    handleSubmit: handleSubmitBomb,
    control: controlBomb,
    formState: { errors: errorsBomb },
  } = useForm<FormData>();

  const {
    handleSubmit: handleSubmitSnakeBody,
    control: controlSnakeBody,
    formState: { errors: errorsSnakeBody },
  } = useForm<FormData>();

  useEffect(() => {
    setIsProcessing(false);
  }, [appleImage, bombImage, snakeBodyImage]);

  const handleGenerateImage = async (
    prompt: string,
    setImage: (url: string) => void,
    setSelectedImage: (url: string | null) => void
  ) => {
    if (!prompt || prompt.trim().length < 2) {
      toast.error("Please enter a valid prompt");
      return;
    }
    setIsProcessing(true);
    const generatedImageUrl = await generateImageFromPrompt(prompt);
    if (generatedImageUrl) {
      setImage(generatedImageUrl);
      setSelectedImage(generatedImageUrl);
      toast.success("Image generated successfully");
    } else {
      toast.error("Failed to generate image");
    }
    setIsProcessing(false);
  };

  return (
    <div className="text-white text-lg font-bold text-left">
      CUSTOMIZE GAME
      <div className="mt-2 flex flex-col justify-center items-center space-y-6 overflow-y-auto">
        {isProcessing ? (
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mb-4"></div>
            <p className="text-xs text-white">GENERATING</p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitApple((data) =>
              handleGenerateImage(
                data.aiAppleImageInput,
                setAppleImage,
                setSelectedAppleImage
              )
            )}
            className="flex flex-col space-y-4"
          >
            <Controller
              name="aiAppleImageInput"
              control={controlApple}
              defaultValue=""
              rules={{ required: true }}
              render={({ field }) => (
                <input
                  {...field}
                  type="text"
                  placeholder="Describe apple to generate"
                  className="input"
                />
              )}
            />
            {errorsApple.aiAppleImageInput && (
              <p className="text-red-500 text-xs">
                Apple description is required
              </p>
            )}
            <button type="submit" className="btn-primary">
              Generate Apple Image
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
