"use client";

import { useSearchParams } from "next/navigation"; 
import { Chat } from "../../components/Chat";
import { Spinner } from "../../components/Spinner";
import { Suspense } from "react";

export default function RoomChat() {
  return (
    <Suspense fallback={<Spinner />}>
      <ChatWrapper />
    </Suspense>
  );
}

function ChatWrapper() {
  const searchParams = useSearchParams();
  const roomId = searchParams.get("roomid");
  const roomname = searchParams.get("roomname");

  if (!roomId) return <Spinner />;
  return <Chat roomId={roomId} roomname={roomname ?? "Untitled Room"} />;
}
