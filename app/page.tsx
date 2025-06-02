"use client"
import { SpotlightCard } from "../components/Spotlightcard";
import { BlurText } from "../components/Blurtext";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter()
  const [loading,setloading] = useState(false)
  const [loadingt,setloadingt] = useState(false)

  return (
    <div>
      <div className="min-h-screen bg-slate-900
 text-white flex flex-col items-center">
      <header className="text-center mt-16 ml-1">
        <BlurText 
          text="Welcome to LogDoubts!"
          delay={40}
          animateBy="letters"
          direction="top"
          className="text-6xl flex justify-center font-bold"
        />
        <BlurText
          text="Connect & Split that Confusion Out"
          delay={50}
          animateBy="words"
          direction="top"
          className="mt-2 flex justify-center text-xl"
        />
      </header>
      <div className="flex justify-center mt-10 hover:scale-105">
      <SpotlightCard className="w-100 p-10 py-15 text-center" spotlightColor="rgba(0, 229, 255, 0.2)">
        <h2 className="text-2xl font-bold mb-4 text-white">Get Started</h2>
        <div className="w-[200px] h-[200px] ml-4 bg-cover bg-center bg-no-repeat"style={{ backgroundImage: "url('/jumbopng.png')" }}>
        </div>
        <p className="text-gray-300 mb-5">Choose an option</p>
        <div className="flex flex-col gap-4">
          <button className={`w-full border-2 border-white text-white py-2 rounded-lg hover:bg-white hover:text-black hover:border-black
 hover:scale-105 transition ${loading?"animate-pulse":"animate-none"}`}  onClick={()=>{
  setloading(true)
  router.push("./Join")
 }}>
            {loading?"Redirecting...":"Join the Room"}
          </button>
          <button className={`w-full border-2 border-white text-white py-2 rounded-lg hover:bg-white hover:text-black hover:border-black
 hover:scale-105 transition ${loadingt?"animate-pulse":"animate-none"}`} onClick={()=>{
  setloadingt(true)
  router.push("./Create")
 }}>
            {loadingt?"Redirecting...":"Create a Room"}
          </button>
        </div>
      </SpotlightCard>
      </div>
    </div>
      <footer className="mt-3 bg-black py-6 text-center">
        <div className="text-white">
          Made with <span className="animate-pulse">❤️</span> by kowshik varma kucharallapati!
        </div>
      </footer>
    </div>
      );
}
