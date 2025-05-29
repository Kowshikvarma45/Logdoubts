"use client"

import { useRouter } from "next/navigation"

export default function() {
    const router = useRouter()
    return (
        <div>
            <div className="min-h-screen items-cneter flex justify-center">

                <h1 className="text-4xl font-bold"> Some error occured</h1>
                <button className="bg-green-800 text-white p-3" onClick={()=>{
                    router.push("../../../")
                }}>Back to Home</button>

            </div>
        </div>
    )
}