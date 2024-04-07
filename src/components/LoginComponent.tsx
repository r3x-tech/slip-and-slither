import { useEffect, useState } from "react";
import userStore from "../stores/userStore";
import toast from "react-hot-toast";
import {
  getPlayersByWalletAddress,
  insertPlayerEntry,
} from "../services/supabase";
import { countryPhoneCodes } from "./constants";
import { FaCopy, FaDiscord, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { useLoginModalStore } from "../stores/useLoginModalStore";
import { useLoadingStore } from "../stores/useLoadingStore";
import { saveHighScore } from "../services/supabase";
import { useScoreStore } from "../stores/useScoreStore";
import { useScoreSavedModalStore } from "../stores/useScoreSavedModalStore";
import { useGameOverModalStore } from "../stores/useGameOverModalStore";
import React from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useConnect, useSolana } from "@particle-network/auth-core-modal";
import { UserInfo } from "@particle-network/auth-core";
import { getUSDCBalance } from "../services/shyft";

export const LoginComponent = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState("+1");
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [loggedInStatus, setLoggedInStatus] = useState(false);
  const [logoutStatus, setLogoutStatus] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);
  const { showLoginModal, setShowLoginModal } = useLoginModalStore();
  const { showGameOverModal, setShowGameOverModal } = useGameOverModalStore();
  const loadingStatus = useLoadingStore((state) => state.loadingStatus);
  const currentScoreToSave = useScoreStore((state) => state.score);
  const { showScoreSavedModal, setShowScoreSavedModal } =
    useScoreSavedModalStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentUsdcBalance, setCurrentUsdcBalance] = useState<string | null>(
    null
  );

  const {
    address,
    chainId,
    chainInfo,
    switchChain,
    signMessage,
    signTransaction,
    signAllTransactions,
    signAndSendTransaction,
    enable,
  } = useSolana();
  const {
    connect: particleConnect,
    connected: particleConnected,
    disconnect: particleDisconnect,
  } = useConnect();

  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    currentConnection,
    currentUserInfo,
    currentWallet,
    ip_address,
    userProfilePic,
  } = userStore();

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(solana_wallet_address);
      toast.success("Copied Wallet Address");
    } catch (err) {
      console.error("Failed to copy address: ", err);
      toast.error("Failed to copy address");
    }
  };

  const formatUsername = (name: string) => {
    if (name.length <= 16) {
      return name;
    }
    if (name == "") {
      return "NA";
    }
    return `${name.substring(0, 7)}...${name.substring(name.length - 4)}`;
  };

  const formatWalletAddress = (name: string) => {
    if (name.length <= 16) {
      return name;
    }
    if (name == "") {
      return "NA";
    }
    return `${name.substring(0, 5)}...${name.substring(name.length - 5)}`;
  };

  const countryCodeToFlagEmoji = (iso: any) => {
    const offset = 127397;
    return [...iso]
      .map((char) => String.fromCodePoint(char.charCodeAt() + offset))
      .join("");
  };

  useEffect(() => {
    if (loggedIn || userStore.getState().loggedIn) {
      setLoggedInStatus(true);
    } else {
      setLoggedInStatus(false);
    }
  }, [loggedIn]);

  useEffect(() => {
    const checkAndInsertToDatabase = async () => {
      const entry = await getPlayersByWalletAddress(solana_wallet_address);
      if (!entry) {
        console.log("RUNNING INSERT TO DB");

        await insertPlayerEntry(
          username,
          loginType,
          solana_wallet_address,
          ip_address
        );
      }
      toast.success("Logged in");
      setLoginInProgress(false);
    };
    if (loggedIn && solana_wallet_address.trim() !== "") {
      console.log("RUNNING DB CHECK");
      checkAndInsertToDatabase();
    }
  }, [ip_address, loggedIn, loginType, solana_wallet_address, username]);

  useEffect(() => {
    if (
      solana_wallet_address.trim() !== "" &&
      loadingStatus &&
      loggedIn &&
      !showScoreSavedModal &&
      showGameOverModal
    ) {
      if (loadingStatus == true) {
        saveHighScore(currentScoreToSave)
          .then(() => {
            useLoadingStore.getState().setLoadingStatus(false);
            setShowScoreSavedModal(true);
          })
          .catch((error) => {
            useLoadingStore.getState().setLoadingStatus(false);
          });
      }
    }
  }, [
    currentScoreToSave,
    loadingStatus,
    loggedIn,
    setShowScoreSavedModal,
    showGameOverModal,
    showScoreSavedModal,
    solana_wallet_address,
  ]);

  useEffect(() => {
    const fetchUSDCBalance = async () => {
      if (solana_wallet_address) {
        const balanceData = await getUSDCBalance(solana_wallet_address);
        if (balanceData && balanceData.success) {
          setCurrentUsdcBalance(balanceData.result.balance.toFixed(2));
        } else {
          setCurrentUsdcBalance("N/A");
        }
      }
    };

    fetchUSDCBalance();
  }, [solana_wallet_address]);

  const handlePhoneLogin = async () => {
    setLoginInProgress(true);
    const cleanPhone = phone.replace(/-/g, "");

    if (!loggedIn) {
      if (!(selectedCountryCode + cleanPhone).match(/^\+\d{1,14}$/)) {
        console.log("phone error");
        console.log("phone: ", cleanPhone);
        console.log("phone number: ", selectedCountryCode + cleanPhone);

        setPhoneError(true);
      } else {
        try {
          setPhoneError(false);
          console.log("phone: ", cleanPhone);
          let userInfo: UserInfo | undefined;

          userInfo = await particleConnect({
            phone: selectedCountryCode + cleanPhone,
          });

          if (!userInfo && userInfo != undefined) {
            throw Error("User unavailable");
          }

          if (!address) {
            throw Error("Address unavailable");
          }

          if (!signTransaction) {
            throw Error("Signing unavailable 0x1");
          }

          if (!signAllTransactions) {
            throw Error("Signing unavailable 0x2");
          }

          fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data) => {
              userStore.setState({
                loggedIn: true,
                loginType: "PHONE",
                username: userInfo!.phone || "",
                solana_wallet_address: address,
                currentWallet: {
                  publicKey: new PublicKey(address),
                  signTransaction: signTransaction,
                  signAllTransactions: signAllTransactions,
                },
                currentUserInfo: userInfo,
                ip_address: data.ip,
              });
            });
          setPhone("");
        } catch (e) {
          console.log("login error: " + JSON.stringify(e));
        } finally {
          setLoginInProgress(false);
        }
      }
    }
  };

  const handleLogout = async () => {
    try {
      setLogoutStatus(true);

      if (particleConnected && loggedIn) {
        await particleDisconnect().then(() => {
          console.log("logout");
        });
        userStore.setState({
          loggedIn: false,
          loginType: "",
          username: "",
          solana_wallet_address: "",
          currentConnection: null,
          signTransaction: null,
          signAllTransactions: null,
          currentProvider: null,
          currentWallet: null,
        });
        toast.success("Logged out");
        setLogoutStatus(false);
        window.location.href = "/";
      } else {
        toast.error("Failed to logout! 0x1");
        setLogoutStatus(false);
        return;
      }
    } catch (e) {
      toast.error("Failed to logout! 0x2");
    }
  };

  return (
    <>
      <div className="relative">
        <button
          className={`font-montserrat text-xs font-bold border-2 border-white rounded-none h-8 text-white hover:bg-white hover:text-black cursor-pointer px-4 ${
            loggedInStatus || loginInProgress ? "border-white" : ""
          }`}
          onClick={() => setShowLoginModal(!showLoginModal)}
        >
          {loggedInStatus
            ? `${username.slice(0, 5)}...${username.substring(
                username.length - 4
              )}`
            : loginInProgress
            ? "LOGGING IN..."
            : "LOGIN"}
        </button>

        {showLoginModal && (
          <div
            className="absolute right-0 mt-2 w-96 bg-black text-white border-2 border-white rounded-none outline-none z-50 shadow-xl"
            style={{ boxShadow: "1px 1px 20px black" }}
          >
            {loginInProgress ? (
              <div className="flex flex-col items-center justify-center text-white mt-20 mb-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p className="mt-3 text-xs font-medium">LOGGING IN</p>
              </div>
            ) : loggedInStatus ? (
              <div className="flex flex-col space-y-4 p-4 items-start">
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center m-3">
                    <div>
                      <img
                        src={userProfilePic}
                        alt="User Profile Pic"
                        className="w-12 h-12 mr-4 cursor-pointer"
                        onClick={() => {}}
                      />
                    </div>
                    <div
                      className="tooltip"
                      data-tip="Wallet Address"
                      style={{
                        position: "relative",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                    >
                      <p className="text-white">
                        {formatWalletAddress(solana_wallet_address)}
                      </p>
                      <span
                        className="tooltiptext"
                        style={{
                          visibility: "hidden",
                          backgroundColor: "black",
                          color: "white",
                          textAlign: "center",
                          padding: "5px",
                          borderRadius: "6px",
                          position: "absolute",
                          zIndex: 1,
                          bottom: "125%",
                          left: "50%",
                          marginLeft: "-60px",
                          opacity: 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        Wallet Address
                      </span>
                    </div>

                    <div
                      className="tooltip ml-2 hover:text-gray-300"
                      data-tip="Copy"
                      style={{
                        position: "relative",
                        display: "inline-block",
                        cursor: "pointer",
                      }}
                      onClick={handleCopyClick}
                    >
                      <FaCopy />
                      <span
                        className="tooltiptext"
                        style={{
                          visibility: "hidden",
                          backgroundColor: "black",
                          color: "white",
                          textAlign: "center",
                          padding: "5px",
                          borderRadius: "6px",
                          position: "absolute",
                          zIndex: 1,
                          bottom: "125%",
                          left: "50%",
                          marginLeft: "-30px",
                          opacity: 0,
                          transition: "opacity 0.3s",
                        }}
                      >
                        Copy
                      </span>
                    </div>
                  </div>

                  <div className="flex w-full h-full justify-start items-center">
                    <div className="flex w-52 h-9 justify-center items-center">
                      <p className="text-base font-bold text-primary">
                        Balance:
                      </p>
                      <p className="ml-2 text-base font-bold text-green-700">
                        ${currentUsdcBalance ? currentUsdcBalance : "N/A"} USDC
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <button
                      className="text-sm font-bold hover:text-gray-300"
                      onClick={() =>
                        window.open(
                          "https://www.r3x.tech/contact",
                          "_blank",
                          "noopener noreferrer"
                        )
                      }
                    >
                      Need Help?
                    </button>
                  </div>

                  <button
                    className="text-sm font-bold text-red-700 hover:text-red-800"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : logoutStatus ? (
              <div className="flex flex-col items-center justify-center text-white mt-20 mb-20">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                <p className="mt-3 text-xs font-medium">LOGGING OUT</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}
      </div>
    </>
  );
};
