import { create } from "zustand";

type ProductStatusState = {
  canPurchase: boolean;
  setCanPurchase: (canPurchase: boolean) => void;
  purchaseInProgress: boolean;
  setPurchaseInProgress: (purchaseInProgress: boolean) => void;
};

export const useProductStatusStore = create<ProductStatusState>((set) => ({
  canPurchase: false,
  setCanPurchase: (canPurchase: boolean) => set({ canPurchase }),
  purchaseInProgress: false,
  setPurchaseInProgress: (purchaseInProgress: boolean) =>
    set({ purchaseInProgress }),
}));
