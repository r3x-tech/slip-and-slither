import React, { useState, useEffect } from "react";
import { useGameOverModalStore } from "../stores/useGameOverModalStore";
import { saveHighScore } from "../services/supabase";
import { useScoreStore } from "../stores/useScoreStore";
import { useLoadingStore } from "../stores/useLoadingStore";
import { useLoginModalStore } from "../stores/useLoginModalStore";
import userStore from "../stores/userStore";
import { useScoreSavedModalStore } from "../stores/useScoreSavedModalStore";
import toast from "react-hot-toast";
import SimplePhaserGameComponent from "./SimplePhaserGameComponent";

const PhaserGameWrapper: React.FC = () => {
  const { showGameOverModal, setShowGameOverModal } = useGameOverModalStore();
  const score = useScoreStore((state: any) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();

  const saveHighscore = async () => {
    useLoadingStore.getState().setLoadingStatus(true);
    console.log("loading status: ", useLoadingStore.getState().loadingStatus);
    if (
      userStore.getState().solana_wallet_address.trim() === "" ||
      userStore.getState().solana_wallet_address === null
    ) {
      console.log(
        "SWA in saveHighscore is: ",
        userStore.getState().solana_wallet_address
      );
      setShowGameOverModal(false);
      console.log("show modal in saveHighscore is: ", showGameOverModal);
      useScoreStore.getState().setScore(score);
      useLoginModalStore.getState().setShowLoginModal(true);
      console.log(
        "show modal login state: ",
        useLoginModalStore.getState().showLoginModal
      );
    } else {
      if (loadingStatus === true) {
        saveHighScore(score)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
            useScoreStore.getState().setScore(0);
          })
          .catch((error) => {
            useLoadingStore.getState().setLoadingStatus(false);
          });
      }
    }
  };

  const walletAddress = userStore((state) => state.solana_wallet_address);
  const loadingStatus = useLoadingStore((state) => state.loadingStatus);

  useEffect(() => {
    if (walletAddress.trim() !== "") {
      if (loadingStatus === true) {
        saveHighScore(score)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
            toast.success("Score saved!");
          })
          .catch((error) => {
            console.error("Failed to save score: ", error);
            useLoadingStore.getState().setLoadingStatus(false);
            toast.error("Failed to save score!");
          });
      }
    }
  }, [walletAddress, score, loadingStatus, setShowScoreSavedModal]);

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-[360px] h-full w-full pt-2 font-montserrat">
      {showGameOverModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={stopPropagation}
        >
          <div
            className="bg-black border-2 border-white rounded-none mt-48 py-2.5 w-[362px] h-[362px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center justify-center h-full">
              {useLoadingStore.getState().loadingStatus ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  <p className="text-white mt-2">SAVING</p>
                </div>
              ) : (
                <>
                  <button
                    className="bg-[#665EFF] text-white w-full border-2 border-[#665EFF] h-[6vh] rounded-none font-extrabold disabled:opacity-50 hover:bg-[#817df2] hover:border-[#817df2]"
                    disabled
                    onClick={() => setShowGameOverModal(false)}
                  >
                    CLAIM PRIZE
                  </button>
                  <button
                    className="bg-[#0dd353] text-white w-full border-2 border-[#0dd353] h-[6vh] rounded-none font-extrabold disabled:opacity-50 hover:bg-[#04e762] hover:border-[#04e762]"
                    disabled={showScoreSavedModal || score < 1}
                    onClick={saveHighscore}
                  >
                    SAVE HIGHSCORE
                  </button>
                  <button
                    className="bg-[#FF1644] text-white w-full border-2 border-[#FF1644] h-[6vh] mt-12 rounded-none font-extrabold hover:bg-[#ff4769] hover:border-[#ff4769]"
                    onClick={() => {
                      setShowGameOverModal(false);
                      setShowScoreSavedModal(false);
                    }}
                  >
                    CLOSE
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      <SimplePhaserGameComponent />
    </div>
  );
};

export default PhaserGameWrapper;
