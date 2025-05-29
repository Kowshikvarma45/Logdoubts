"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert } from "../../components/Alert";

export default function Home() {
    const [roomid, setroomid] = useState<string>("");
    const [loading, setloading] = useState(false);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);
    const router = useRouter();

    function showAlert(msg: string) {
        setAlertMsg(msg);
        setTimeout(() => setAlertMsg(null), 5000);
    }

    async function handlejoin(event: React.FormEvent) {
        event.preventDefault();
        setloading(true);
        if(roomid == "") {
            showAlert("Enter the Roomid")
            setloading(false)
            return
        }

        try {
            const res:any = await axios.post(
                "/api/RoomExist",
                { roomid: roomid },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.status === 200) {
                router.push(`../RoomChat/?roomid=${roomid}&roomname=${res.data.roomname}`);
            } else {
                showAlert("Sorry, the defined room ID doesn't exist.");
            }
        } catch (err) {
            showAlert("Sorry, Check the internet connection and tryagain.");
            console.log(err)
        } finally {
            setloading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
            {alertMsg && <Alert msg={alertMsg} />}
            <div className="w-full max-w-md bg-slate-800 bg-opacity-10 backdrop-blur-md shadow-xl rounded-lg p-6 border border-gray-700">
                <h2 className="text-2xl font-bold text-white text-center mb-4">Join a Chat Room</h2>
                <form onSubmit={handlejoin} className="flex flex-col space-y-4">
                    <input
                        className="w-full p-3 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        type="text"
                        placeholder="Enter Room ID"
                        onChange={(e) => setroomid(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`w-full bg-green-500 text-white py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition-all duration-200 ${
                            loading ? "animate-pulse" : "animate-none"
                        }`}
                    >
                        {loading ? "Joining the Room..." : "Join Room"}
                    </button>
                </form>
            </div>
        </div>
    );
}
