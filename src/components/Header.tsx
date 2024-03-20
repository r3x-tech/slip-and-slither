import React, { useState } from "react";
import { MdLeaderboard, MdClose } from "react-icons/md";
import { TbMoodEdit } from "react-icons/tb";
import { Leaderboard } from "./Leaderboard";
import { Customize } from "./Customize";
import { useConnect, useSolana } from "@particle-network/auth-core-modal";
import userStore from "../stores/userStore";
import { PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";
import { Tournaments } from "./Tournaments";
import { IoMdTrophy } from "react-icons/io";

interface HeaderProps {
  onConnect: () => void;
  authStatus: string;
}

const Header: React.FC<HeaderProps> = ({ onConnect, authStatus }) => {
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showCustomize, setShowCustomize] = useState<boolean>(false);
  const [showTournaments, setShowTournaments] = useState<boolean>(false);
  const [loginInProgress, setLoginInProgress] = useState<boolean>(false);
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
    connectionStatus,
    requestConnectCaptcha,
    setSocialConnectCallback,
  } = useConnect();

  const {
    username,
    loggedIn,
    loginType,
    solana_wallet_address,
    currentConnection,
    ip_address,
    userProfilePic,
  } = userStore();

  const handlePhoneLogin = async () => {
    setLoginInProgress(true);
    // const cleanPhone = phone.replace(/-/g, "");

    if (!loggedIn) {
      try {
        let userInfo = await particleConnect();

        if (!userInfo && userInfo !== undefined) {
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
              ip_address: data.ip,
            });
          });
        toast.success("Logged in");
      } catch (e) {
        console.log("login error: " + JSON.stringify(e));
        toast.error("Failed to login");
      } finally {
        setLoginInProgress(false);
      }
    }
  };

  return (
    <header
      className="w-full flex justify-center items-end min-h-10 mt-2 mb-2"
      style={{ position: "relative", zIndex: 10 }}
    >
      <div className="w-full max-w-[360px] flex justify-between items-center">
        <div className="flex-1 flex justify-start">
          <button
            onClick={() => handlePhoneLogin()}
            className="px-4 py-2 border-2 border-white text-white font-bold font-body hover:bg-white hover:text-black transition-colors duration-150 ease-in-out font-montserrat text-xs tracking-widest"
            style={{ fontWeight: 700 }}
          >
            LOGIN
          </button>
        </div>
        <div className="flex-1 flex justify-between items-center">
          <div className="flex-1 flex justify-start">
            <div className="relative inline-block text-left">
              <div>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowLeaderboard(!showLeaderboard);
                    setShowCustomize(false);
                    setShowTournaments(false);
                  }}
                >
                  <MdLeaderboard size="1.75rem" color="white" />
                </span>
              </div>
              {showLeaderboard && (
                <div
                  className="origin-top-right absolute mt-3.5 rounded-none shadow-lg bg-black border-2 border-white"
                  style={{
                    zIndex: 100,
                    left: "54%",
                    transform: "translateX(-54%)",
                    width: "365px",
                    height: "365px",
                  }}
                >
                  <div className="py-5 px-5 relative">
                    <button
                      className="absolute top-5 right-5 font-semibold text-primary"
                      onClick={() => setShowLeaderboard(false)}
                    >
                      <MdClose color="white" size="1.5em" />{" "}
                    </button>
                    <Leaderboard />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative inline-block text-left">
              <div>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowCustomize(!showCustomize);
                    setShowLeaderboard(false);
                    setShowTournaments(false);
                  }}
                >
                  <TbMoodEdit size="1.75rem" color="white" />
                </span>
              </div>
              {showCustomize && (
                <div
                  className="origin-top-right absolute mt-3.5 rounded-none shadow-lg bg-black border-2 border-white"
                  style={{
                    zIndex: 100,
                    left: "76.5%",
                    transform: "translateX(-76.5%)",
                    width: "365px",
                    height: "365px",
                  }}
                >
                  <div className="py-5 px-5 relative">
                    <button
                      className="absolute top-5 right-5 font-semibold text-gray-400 hover:text-gray-200 transition duration-150 ease-in-out"
                      onClick={() => {
                        setShowTournaments(!showTournaments);
                        setShowLeaderboard(false);
                        setShowCustomize(false);
                      }}
                    >
                      <MdClose color="white" size="1.5em" />{" "}
                    </button>

                    <Customize />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex justify-end">
            <div className="relative inline-block text-left">
              <div>
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setShowTournaments(!showTournaments);
                    setShowLeaderboard(false);
                    setShowCustomize(false);
                  }}
                >
                  <IoMdTrophy size="1.75rem" color="white" />
                </span>
              </div>
              {showTournaments && (
                <div
                  className="origin-top-right absolute mt-3.5 rounded-none shadow-lg bg-black border-2 border-white"
                  style={{
                    zIndex: 100,
                    left: "99%",
                    transform: "translateX(-99%)",
                    width: "365px",
                    height: "365px",
                  }}
                >
                  <div className="py-5 px-5 relative">
                    <button
                      className="absolute top-5 right-5 font-semibold text-gray-400 hover:text-gray-200 transition duration-150 ease-in-out"
                      onClick={() => setShowTournaments(false)}
                    >
                      <MdClose color="white" size="1.5em" />
                    </button>

                    <Tournaments />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
