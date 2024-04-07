import { create } from "zustand";

interface ProductState {
  product: any;
  setProduct: (product: any) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  product: null,
  setProduct: (product) => set({ product }),
}));
