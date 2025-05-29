"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import RoomComponent from "../../components/RoomComponent";
import { useSession } from "next-auth/react";
import { Spinner } from "../../components/Spinner";
import { useRouter } from "next/navigation";


interface Room {
  roomid: string;
  roomname: string;
  creator: { username: string };
  createdAt: string;
}

export default function CreatedRooms() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter()

  useEffect(() => {
    if (!session || !session.user) {
      router.push("../Account")
    };

    const fetchRooms = async () => {
      try {
        const response:any = await axios.post(
          "/api/GetUserCreatedRooms",
          { 
            //@ts-expect-error
            userid: session.user.userid 
          }
        );
        if (response.status === 200) {
          if (Array.isArray(response.data.createdrooms)) {
            setRooms(response.data.createdrooms);
          } else {
            alert("Invalid data received.");
          }
        }
        else {
          alert(response.data.msg)
        }
      } catch (error) {
        alert("Rooms fetch failed.Reload again!")
        console.log("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [session]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-extrabold text-gray-200 mb-8 tracking-wide">Your Created Rooms</h1>
      
      {rooms.length === 0 ? (
        <p className="text-gray-400 text-lg">No rooms created yet.</p>
      ) : (
        <div className="w-full max-w-4xl flex flex-col items-center gap-6">
          {rooms.map((room) => (
            <RoomComponent
              key={room.roomid}
              roomname={room.roomname}
            //@ts-expect-error
              creator={session?.user?.username || "unknown"}
              createdAt={new Date().toLocaleDateString()}
              onJoin={`../RoomChat/?roomid=${room.roomid}&roomname=${room.roomname}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
