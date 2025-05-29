"use client";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Spinner } from "../../../../components/Spinner";
import { motion } from "framer-motion";
import { Alert } from "../../../../components/Alert";

export default function LoginForm() {
    const router = useRouter();
    const session = useSession();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setloading] = useState(false);
    const [alertMsg, setAlertMsg] = useState<string | null>(null);

    function showAlert(msg: string) {
        setAlertMsg(msg);
        setTimeout(() => setAlertMsg(null), 5000);
    }

    async function handler(event: React.FormEvent) {
        event.preventDefault();
        setloading(true);

        if (username === "" || email === "" || password === "") {
            showAlert("Enter all credentials to create an account");
            setloading(false);
            return;
        }

        try {
            const res:any = await axios.post(
                "/api/CreateUser",
                { username, email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.status === 200) {
                showAlert("User successfully created. Redirecting to login page");
                setTimeout(async () => await signIn(), 1500);
            } else {
                showAlert(res.data.msg);
                setloading(false)
            }
        } catch (err) {
            console.log("Error:", err);
            //@ts-expect-error
            showAlert(err.response?.data?.msg || "Something went wrong.");
        }
    }

    useEffect(() => {
        if (session.data?.user) {
            router.push("../../../");
        }
    }, [session.data?.user, router]);

    if (!session.data?.user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                {alertMsg && <Alert msg={alertMsg} />}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }} 
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-gray-800 p-10 rounded-2xl w-full max-w-md space-y-6 shadow-lg"
                >
                    <h1 className="text-3xl font-bold text-center text-white">
                        <span className="text-green-500">Welcome</span>
                    </h1>

                    <form className="space-y-6" onSubmit={handler}>
                        <div className="space-y-4">
                            {[ 
                                { label: "Username", type: "text", value: username, setter: setUsername },
                                { label: "Email", type: "email", value: email, setter: setEmail },
                                { label: "Password", type: "password", value: password, setter: setPassword }
                            ].map(({ label, type, value, setter }, index) => (
                                <div key={index}>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
                                    <input
                                        type={type}
                                        placeholder={label}
                                        value={value}
                                        onChange={(e) => setter(e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 
                                           text-white placeholder-gray-400 focus:outline-none focus:border-green-500
                                           focus:ring-2 focus:ring-green-500 transition-all duration-300"
                                    />
                                </div>
                            ))}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className={`w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white font-semibold
                               transition-all duration-300 shadow-md ${loading ? "animate-pulse" : "animate-none"}`}
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </motion.button>

                        <div className="text-sm text-center text-gray-400">
                            Have an account? {" "}
                            <button
                                type="button"
                                className="text-green-500 hover:text-green-400 font-medium transition-all"
                                onClick={() => router.push("../auth/signin")}
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white animate-pulse text-5xl">
                <Spinner />
            </div>
        );
    }
}
