import { create } from "zustand";

type ModalState = {
  showGameOverModal: boolean;
  setShowGameOverModal: (showGameOverModal: boolean) => void;
  prizeClaimable: boolean;
  setPrizeClaimable: (prizeClaimable: boolean) => void;
};

export const useGameOverModalStore = create<ModalState>((set) => ({
  showGameOverModal: false,
  setShowGameOverModal: (showGameOverModal: boolean) =>
    set({ showGameOverModal }),
  prizeClaimable: false,
  setPrizeClaimable: (prizeClaimable: boolean) => set({ prizeClaimable }),
}));
