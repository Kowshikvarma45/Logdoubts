"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface RoomProps {
  roomname: string;
  creator: string;
  createdAt: string;
  onJoin: string;
}

const RoomComponent: React.FC<RoomProps> = ({
  roomname,
  creator = "Unknown",
  createdAt = "Unknown date",
  onJoin,
}) => {
  const router = useRouter();
  const [joinloading, setjoinloading] = useState(false);

  return (
    <div className="group relative bg-[#232428]/80 backdrop-blur-lg border border-gray-950 rounded-xl shadow-md p-5 w-full max-w-lg transition-all hover:shadow-xl">
      <h2 className="text-2xl font-semibold text-white tracking-wide">{roomname}</h2>
      <p className="text-sm text-gray-400 mt-1">
        Created by: <span className="text-gray-300">{creator}</span>
      </p>
      <p className="text-xs text-gray-500">Created on: {createdAt}</p>

      <button
        className={`mt-4 w-full bg-green-600 hover:bg-green-800 text-white font-bold py-2 rounded-lg shadow-md transition-all duration-200 ${
          joinloading ? "animate-pulse" : "animate-none"
        }`}
        onClick={() => {
          setjoinloading(true);
          router.push(onJoin);
        }}
      >
        {joinloading ? "Joining the Room..." : "Join Room"}
      </button>
      <div className="absolute inset-0 rounded-xl border border-transparent transition-all z-[-1]"></div>
    </div>
  );
};

export default RoomComponent;
