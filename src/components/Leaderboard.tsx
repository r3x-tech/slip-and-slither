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
    // Only fetch global leaderboard scores when the global tab is active
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
        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === LeaderboardType.Global
                  ? "text-white border-white"
                  : "border-transparent hover:text-gray-300 hover:border-gray-500"
              } focus:outline-none`}
              onClick={() => setActiveTab(LeaderboardType.Global)}
            >
              GLOBAL
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 ${
                activeTab === LeaderboardType.Personal
                  ? "text-white border-white"
                  : "border-transparent hover:text-gray-300 hover:border-gray-500"
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
          <span className="font-body text-lg font-bold text-white w-8">
            {index + 1}.
          </span>
          <div className="flex-1 ml-2 p-2 bg-gray-700 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-body text-sm text-white">{`${score.user.slice(
                0,
                5
              )}...${score.user.slice(-3)}`}</span>
              <span className="font-body text-sm text-white">
                {score.score}
              </span>
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
        <p className="text-white font-body text-xs font-normal tracking-wide">
          PERSONAL LEADERBOARD COMING SOON
        </p>
      </div>
    );
  }
}
