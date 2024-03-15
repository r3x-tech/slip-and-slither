import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";

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
    <div className="bg-background min-h-screen flex flex-col justify-between">
      <Header onConnect={handleConnect} authStatus={authStatus} />
      {/* Your content here */}
      <Footer />
    </div>
  );
}

export default App;
