import React, { useState, useEffect } from "react";
import { getLeaderboard, Score } from "../services/supabase";

export function Leaderboard() {
  const [topScores, setTopScores] = useState<Score[]>([]);

  useEffect(() => {
    getLeaderboard().then(setTopScores);
  }, []);

  return (
    <>
      <h1 className="text-white text-xl font-bold font-body w-full h-full text-left tracking-wide">
        LEADERBOARDS
      </h1>
      <div className="border-b border-gray-200">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 text-white border-transparent hover:text-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => {}}
            >
              GLOBAL
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`inline-block p-4 rounded-t-lg border-b-2 text-white border-transparent hover:text-gray-300 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
              onClick={() => {}}
            >
              PERSONAL
            </button>
          </li>
        </ul>
      </div>
      <div
        className="p-0 m-0 overflow-y-auto"
        style={{ height: "calc(22rem - 6rem)" }}
      >
        {topScores.length > 0 ? (
          topScores.map((score, index) => (
            <div key={index} className="flex items-center h-10">
              <span className="text-lg font-bold text-white w-8">
                {index + 1}.
              </span>
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
        )}
      </div>
    </>
  );
}
