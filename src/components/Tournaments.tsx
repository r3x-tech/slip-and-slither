import React, { useState, useEffect } from "react";
// import { Tournament, getTournamentsByGameName } from "../services/tournament";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

export function Tournaments() {
  // const [tournaments, setTournaments] = useState<Tournament[]>([]);

  // useEffect(() => {
  //   getTournamentsByGameName("Meteor Crash").then((data: Tournament[]) => {
  //     setTournaments(data);
  //   });
  // }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, "0");
  };

  const timeRemaining = (start: string, end: string) => {
    let now = dayjs();
    let startDate = dayjs(start);
    let endDate = dayjs(end);

    let diff;
    let status;

    if (now.isBefore(startDate)) {
      diff = dayjs.duration(startDate.diff(now));
      status = "Starts in";
    } else if (now.isBefore(endDate)) {
      diff = dayjs.duration(endDate.diff(now));
      status = "Ends in";
    } else {
      diff = dayjs.duration(0);
      status = "Ended";
    }

    return {
      time: `${formatNumber(diff.days())}d ${formatNumber(
        diff.hours()
      )}h ${formatNumber(diff.minutes())}m`,
      status: status,
    };
  };

  return (
    <>
      {" "}
      <h1 className="text-white text-xl font-bold font-body w-full h-full text-left tracking-wide">
        TOURNAMENTS
      </h1>
      <div className="mt-2 w-full space-y-3">
        <p className="text-white text-left my-10 text-sm">
          NO ACTIVE TOURNAMENTS
        </p>
        {/* {tournaments.length > 0 ? (
          tournaments.map((tournament: Tournament, index: number) => {
            const { time, status } = timeRemaining(
              tournament.start_datetime,
              tournament.end_datetime
            );
            return (
              <a
                key={index}
                href={`https://rex-retro-tournaments.r3x.tech/tournament/${tournament.id}`}
                className="block w-full h-22 p-3 mb-3 bg-gray-900 cursor-pointer"
              >
                <div className="flex flex-col space-y-1">
                  <p className="text-white font-bold text-sm">
                    {`${tournament.tournament_name}`}
                  </p>
                  <p className="text-white text-sm">{`${status}: ${time}`}</p>
                </div>
              </a>
            );
          })
        ) : (
          <p className="text-white text-left my-10 text-sm">
            NO ACTIVE TOURNAMENTS
          </p>
        )} */}
      </div>
    </>
  );
}
