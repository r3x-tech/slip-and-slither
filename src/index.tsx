import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import ReactGA from "react-ga";
import { Solana } from "@particle-network/chains";
import { AuthType } from "@particle-network/auth-core";
import {
  AuthCoreContextProvider,
  PromptSettingType,
} from "@particle-network/auth-core-modal";

const queryClient = new QueryClient();

// Initialize Google Analytics
ReactGA.initialize("G-9478EJWGHV");

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AuthCoreContextProvider
      options={{
        projectId: process.env.REACT_APP_PARTICLE_PROJECT_ID!,
        clientKey: process.env.REACT_APP_PARTICLE_CLIENT_KEY!,
        appId: process.env.REACT_APP_PARTICLE_APP_ID!,
        authTypes: [AuthType.phone],
        themeType: "dark",
        fiatCoin: "USD",
        language: "en",
        // promptSettingConfig: {
        //   promptPaymentPasswordSettingWhenSign: PromptSettingType.first,
        //   promptMasterPasswordSettingWhenLogin: PromptSettingType.first,
        // },
        customStyle: {
          logo: "https://shdw-drive.genesysgo.net/6st6r9F5uqntVoBsH8DomaEimsfqJJXTbEEtGDXPNZex/reload_logo_white_no_back.svg",
          projectName: "Slip & Slither",
          subtitle: "Login with phone to continue",
        },
        wallet: {
          visible: false,
          customStyle: {
            supportChains: [Solana],
          },
        },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </AuthCoreContextProvider>
  </React.StrictMode>
);
