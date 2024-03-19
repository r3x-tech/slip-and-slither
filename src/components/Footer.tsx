import React from "react";

const Footer: React.FC = () => (
  <div className="flex w-full justify-center">
    <div className="flex w-90 justify-between p-4">
      <div
        className="text-center text-white cursor-pointer text-xs"
        onClick={() => window.open("https://www.r3x.tech/", "_blank")}
      >
        2023 REX Slip & Slither. All rights reserved.
      </div>
      <div
        className="text-center text-white cursor-pointer text-xs"
        onClick={() =>
          window.open("https://forms.gle/YXZSaH2PJNvkkucX7", "_blank")
        }
      >
        REPORT AN ISSUE?
      </div>
    </div>
  </div>
);

export default Footer;
