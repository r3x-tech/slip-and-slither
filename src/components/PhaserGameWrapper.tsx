import React, { useEffect } from "react";
import { useGameOverModalStore } from "../stores/useGameOverModalStore";
import { saveHighScore } from "../services/supabase";
import { useScoreStore } from "../stores/useScoreStore";
import { useLoadingStore } from "../stores/useLoadingStore";
import { useLoginModalStore } from "../stores/useLoginModalStore";
import userStore from "../stores/userStore";
import { useScoreSavedModalStore } from "../stores/useScoreSavedModalStore";
import toast from "react-hot-toast";
// import SimplePhaserGameComponent from "./SimplePhaserGameComponent";
import PhaserGameComponent from "./PhaserGameComponent";
import { useProductStatusStore } from "../stores/useProductStatusStore";
import { useProductStore } from "../stores/useProductStore";
import { getProductFromShopify } from "../services/shopify";

const PhaserGameWrapper: React.FC = () => {
  const {
    showGameOverModal,
    setShowGameOverModal,
    prizeClaimable,
    setPrizeClaimable,
  } = useGameOverModalStore();
  const score = useScoreStore((state: any) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();
  const { canPurchase, setCanPurchase } = useProductStatusStore();
  const { product, setProduct } = useProductStore();

  useEffect(() => {
    const fetchProductData = async () => {
      if (canPurchase) {
        try {
          const productData = await getProductFromShopify(
            "9139323961635",
            process.env.NEXT_PUBLIC_SHOP_ACCESS_TOKEN!
          );
          setProduct(productData);
        } catch (error) {
          console.error("Error retrieving product:", error);
        }
      }
    };

    fetchProductData();
  }, [canPurchase, setProduct]);

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

  const claimPrize = async () => {
    useLoadingStore.getState().setLoadingStatus(true);
    console.log("loading status: ", useLoadingStore.getState().loadingStatus);
    if (
      userStore.getState().solana_wallet_address.trim() === "" ||
      userStore.getState().solana_wallet_address === null
    ) {
      console.log(
        "SWA in claimPrize is: ",
        userStore.getState().solana_wallet_address
      );
      setPrizeClaimable(true);
      setShowGameOverModal(true);

      console.log("show modal in claimPrize is: ", showGameOverModal);
      useScoreStore.getState().setScore(score);
      useLoginModalStore.getState().setShowLoginModal(true);
      console.log(
        "show modal login state: ",
        useLoginModalStore.getState().showLoginModal
      );
    } else {
      toast.success("Registered for OraHacks 2024 Airdrop");
      useLoadingStore.getState().setLoadingStatus(false);
    }
  };

  const purchaseProduct = async () => {
    // useLoadingStore.getState().setLoadingStatus(true);
    // console.log("loading status: ", useLoadingStore.getState().loadingStatus);
    useProductStatusStore.getState().setPurchaseInProgress(true);
    window.open(
      "https://c77256-c7.myshopify.com/products/orahacks-t-shirt",
      "_blank"
    );

    useProductStatusStore.getState().setPurchaseInProgress(true);

    // useLoadingStore.getState().setLoadingStatus(false);

    // if (
    //   userStore.getState().solana_wallet_address.trim() === "" ||
    //   userStore.getState().solana_wallet_address === null
    // ) {
    //   console.log(
    //     "SWA in purchaseProduct is: ",
    //     userStore.getState().solana_wallet_address
    //   );
    //   console.log("show modal in purchaseProduct is: ", showGameOverModal);
    //   useScoreStore.getState().setScore(score);
    //   useLoginModalStore.getState().setShowLoginModal(true);
    //   console.log(
    //     "show modal login state: ",
    //     useLoginModalStore.getState().showLoginModal
    //   );
    // } else {
    //   toast.success("Registered for OraHacks 2024 Airdrop");
    //   useLoadingStore.getState().setLoadingStatus(false);
    // }
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
    <div className="flex flex-col justify-center items-center h-[360px] pt-2 font-montserrat">
      {showGameOverModal && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          onClick={stopPropagation}
        >
          <div
            className="bg-black border-2 border-white rounded-none mt-14 p-4 w-[362px] h-[362px]"
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
                    className="bg-[#665EFF] mb-6 text-white w-full border-2 border-[#665EFF] h-[6vh] rounded-none font-extrabold disabled:opacity-50 hover:bg-[#817df2] hover:border-[#817df2]"
                    disabled={prizeClaimable ? true : false}
                    onClick={() => claimPrize()}
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

      {canPurchase && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center"
          onClick={stopPropagation}
        >
          <div
            className="bg-black border-2 border-white rounded-none mt-14 p-4 w-[362px] h-[362px]"
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
                  {product ? (
                    <div className="text-white mt-2">
                      <img
                        src={product.variants.edges[0].node.image.originalSrc}
                        alt={product.title}
                        className="w-32 h-32 object-cover mx-auto"
                      />
                      <p>{product.title}</p>
                      <p>Price: {product.variants.edges[0].node.price}</p>
                      <p>Available Sizes:</p>
                      {/* Display available sizes */}
                      <p>Stock Quantity: {/* Display stock quantity */}</p>
                    </div>
                  ) : (
                    <>
                      <img
                        src="https://c77256-c7.myshopify.com/cdn/shop/files/front.jpg?v=1712358719&width=1426"
                        alt="Ora Logo"
                        className="w-24 h-24 object-cover mx-auto"
                      />
                      <p className="text-white mt-2 text-xl font-bold">
                        OraHacks T-shirt
                      </p>
                      <p className="text-white">Price: $0.10 USD</p>
                      <p className="text-white mb-6">
                        Available Sizes: S, M, L
                      </p>
                    </>
                  )}

                  <button
                    className="bg-[#665EFF] mb-6 text-white w-full border-2 border-[#665EFF] h-[6vh] rounded-none font-extrabold disabled:opacity-50 hover:bg-[#817df2] hover:border-[#817df2]"
                    onClick={purchaseProduct}
                  >
                    PURCHASE
                  </button>

                  <button
                    className="bg-[#FF1644] text-white w-full border-2 border-[#FF1644] h-[6vh] mt-0 rounded-none font-extrabold hover:bg-[#ff4769] hover:border-[#ff4769]"
                    onClick={() => {
                      setShowGameOverModal(false);
                      setShowScoreSavedModal(false);
                      setCanPurchase(false);
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
      <PhaserGameComponent />
    </div>
  );
};

export default PhaserGameWrapper;
