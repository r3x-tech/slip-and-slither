import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import PhaserGameWrapper from "./components/PhaserGameWrapper";

function App() {
  const [authStatus, setAuthStatus] = useState("unauthenticated");

  const handleConnect = async () => {
    try {
      setAuthStatus("authenticated");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-background min-h-screen flex flex-col">
      <Header onConnect={handleConnect} authStatus={authStatus} />
      <PhaserGameWrapper />
      <Footer />
    </div>
  );
}

export default App;
