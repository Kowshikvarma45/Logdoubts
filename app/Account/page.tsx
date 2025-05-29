"use client";

import { useSession,signOut } from "next-auth/react";
import { Clipboard, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Spinner } from "../../components/Spinner";
import { useState } from "react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const user = session?.user;
    const router = useRouter();
    const [loading,setloading] = useState(false)

    if (status === "loading") {
        return (
            <div className="min-h-screen items-center flex justify-center bg-slate-900 text-white animate-pulse text-5xl">
                <Spinner></Spinner>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center bg-slate-900 p-6">
                <div className="bg-gray-800 shadow-lg rounded-lg p-6 text-center">
                    <h2 className="text-2xl font-bold text-white">User Not Logged In</h2>
                    <p className="text-white mt-2 ">Login to verify your account</p>
                    <button
                        className={`mt-4 px-4 py-2 bg-green-600 text-white rounded-md shadow-md hover:bg-green-600 transition ${loading?"animate-pulse":"animate-none"}`}
                        onClick={async () => {
                            setloading(true)
                            router.push("../api/auth/signup");
                        }}
                    >
                        {loading?"Redirecting...":"Signup"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex justify-center items-center bg-gray-900 p-6">
            <div className="w-full max-w-lg bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-green-500 flex items-center justify-center text-white font-bold text-lg rounded-full">
                        {user.name ? user.name[0]?.toUpperCase() : ""}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{user.name}</h2>
                        <p className="text-white">{user.email}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                        <span className="text-gray-700">Username</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{user.name}</span>
                            <Clipboard
                                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800 transition"
                                onClick={() => navigator.clipboard.writeText(user.name || "")}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-gray-100 p-3 rounded-md">
                        <span className="text-gray-700">Email</span>
                        <div className="flex items-center space-x-2">
                            <span className="text-gray-500">{user.email}</span>
                            <Clipboard
                                className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-800 transition"
                                onClick={() => navigator.clipboard.writeText(user.email || "")}
                            />
                        </div>
                    </div>
                </div>

                <button
                    className="mt-6 w-full px-4 py-2 bg-red-500 text-white rounded-md shadow-md flex items-center justify-center space-x-2 hover:bg-red-600 transition"
                    onClick={async () => {
                        await signOut();
                    }}
                >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
}
