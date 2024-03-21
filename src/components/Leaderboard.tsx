import React, { useState, useEffect } from "react";
import { getGlobalLeaderboard, Score } from "../services/supabase";

enum LeaderboardType {
  Global = "GLOBAL",
  Personal = "PERSONAL",
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<LeaderboardType>(
    LeaderboardType.Global
  );
  const [topScores, setTopScores] = useState<Score[]>([]);

  useEffect(() => {
    if (activeTab === LeaderboardType.Global) {
      getGlobalLeaderboard().then(setTopScores);
    }
  }, [activeTab]);

  return (
    <>
      <h1 className="text-white text-xl font-bold font-body w-full h-full text-left tracking-wide">
        LEADERBOARDS
      </h1>
      <div className="border-b border-gray-200">
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center mt-4 w-full">
          <li className="flex-1" role="presentation">
            <button
              className={`inline-block w-full p-2 border-2 font-bold font-body text-xs tracking-wide ${
                activeTab === LeaderboardType.Global
                  ? "text-white border-white"
                  : "border-transparent text-white"
              } focus:outline-none`}
              onClick={() => setActiveTab(LeaderboardType.Global)}
            >
              GLOBAL
            </button>
          </li>
          <li className="flex-1" role="presentation">
            <button
              className={`inline-block w-full p-2 border-2 font-bold font-body text-xs tracking-wide ${
                activeTab === LeaderboardType.Personal
                  ? "text-white border-white"
                  : "border-transparent text-white"
              } focus:outline-none`}
              onClick={() => setActiveTab(LeaderboardType.Personal)}
            >
              PERSONAL
            </button>
          </li>
        </ul>
      </div>
      <div
        className="p-4 overflow-y-auto"
        style={{ height: "calc(22rem - 6rem)" }}
      >
        {activeTab === LeaderboardType.Global && renderGlobalScores()}
        {activeTab === LeaderboardType.Personal && renderComingSoon()}
      </div>
    </>
  );

  function renderGlobalScores() {
    return topScores.length > 0 ? (
      topScores.map((score, index) => (
        <div key={index} className="flex items-center h-10">
          <span className="font-bold text-white w-8 text-lg">{index + 1}.</span>
          <div className="flex-1 ml-2 p-2 bg-gray-700 rounded-md">
            <div className="flex justify-between items-center">
              <span className="text-sm text-white">{`${score.user.slice(
                0,
                5
              )}...${score.user.slice(-3)}`}</span>
              <span className="text-sm text-white">{score.score}</span>
            </div>
          </div>
        </div>
      ))
    ) : (
      <p className="text-white text-center my-2 text-base">
        NO SAVED SCORES FOUND
      </p>
    );
  }

  function renderComingSoon() {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-white text-xs font-normal tracking-wide">
          PERSONAL LEADERBOARD COMING SOON
        </p>
      </div>
    );
  }
}
