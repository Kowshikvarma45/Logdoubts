"use client";

import { useRouter, useSearchParams } from "next/navigation"; 
import { Chat } from "../../components/Chat";
import { Spinner } from "../../components/Spinner";
import { Suspense } from "react";
import { useSession } from "next-auth/react";


export default function RoomChat() {
  const session = useSession();
  if(!session.data?.user) {
    const router = useRouter();
    router.push("../Account")
  }
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
