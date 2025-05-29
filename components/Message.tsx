"use client";

import { useEffect, useRef, useState } from "react";
import { ThumbsUp } from "lucide-react";
import { useSession } from "next-auth/react";
import axios from "axios";

interface MessageProps {
  doubtid:string;
  userid: string;
  name: string;
  title?: string;
  description: string;
  createdat: Date;
  upvotes:{
    userid:string
  }[];
}

export const Message = ({doubtid, userid, name, title, description, createdat, upvotes }: MessageProps) => {
  const session = useSession();
  //@ts-expect-error
  const isUserMessage = userid === session.data?.user.userid;
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(upvotes.length);
  const [expanded, setExpanded] = useState(false);
  const socketref = useRef<WebSocket | null>(null);

  useEffect(()=>{
    try {
      const ws = new WebSocket("http://localhost:8080");
      socketref.current = ws;
      ws.onopen = ()=>console.log("websocket connected")
      ws.onmessage = (event)=>{
        const data = JSON.parse(event.data);
        // console.log("data : ",data)
        // console.log("data in ws of message : ",data)
        if(data.type == "upvote" && data.doubtid == doubtid) {
          setUpvoteCount(data.userupvotes.length);
        }
      }
      ws.onerror = ()=>{}
      async function setupvotestate() {
        const res:any = await axios.post("/api/UserExistCheck",{
          doubtid:doubtid,
          //@ts-expect-error
          userid:session.data?.user.userid
        })
        if(res.status == 200) {
          setUpvoted(res.data.exist)
        }else {
          console.log("upvotes fetch failed!")
        }
      }
      setupvotestate()
      return () => {
        console.log("Closing WebSocket connection");
        ws.close();
      };
    }catch(err) {
      alert("Check the internet connection.")
      console.log(err)
    }
  })

  const MAX_LENGTH = 45; 

  const handleUpvote = async() => {
    // setUpvoteCount((prev) => (upvoted ? prev - 1 : prev + 1));

    try {
      const res:any = await axios.post("/api/setUpvotes",{
        doubtid:doubtid,
        //@ts-expect-error
        userid:session.data?.user.userid,
        insert:!upvoted
      })
      if(res.status == 200) {
        console.log("awaittt :",res.data)
        setUpvoted((prev) => !prev);
        setUpvoteCount(res.data.upvotes.length)
        const obj = {
          type:"upvote",
          doubtid:doubtid,
          //@ts-expect-error
          userid:session.data?.user.userid,
          userupvotes:res.data.upvotes
        }
        socketref.current?.send(JSON.stringify(obj))
      }else {
        alert("some unknown error")
      }
    }catch(err) {
      alert("check the internet connection")
      console.log(err)
    }
  };

  return (
    <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"} px-6 py-2 space-x-2`}>
      {!isUserMessage && (
        <div className="flex-shrink-0 w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={`flex flex-col space-y-2 ${isUserMessage ? "items-end" : "items-start"}`}>
        <span className={`text-xs font-semibold ${isUserMessage ? "text-green-500" : "text-blue-500"}`}>
          {name}
        </span>

        <div
          className={`relative px-4 py-3 text-sm rounded-xl shadow-lg transition-all duration-200 
                      break-words whitespace-pre-wrap max-w-[350px] w-fit ${
                        isUserMessage ? "border-2 border-green-700 text-white" : "border-2 border-white text-white"
                      }`}
        >
          {title && <h3 className="font-serif text-2xl mb-1">{title}</h3>}
          <div className={`${isUserMessage?"border-b-2 border-white":"border-b-2 border-gray-400"}`}></div>
          <p>
            {expanded ? description : description.slice(0, MAX_LENGTH) + (description.length > MAX_LENGTH ? "..." : "")}
          </p>

          {description.length > MAX_LENGTH && (
            <button
              className={`${isUserMessage?"text-white":"text-blue-500"} text-xs font-medium mt-1 hover:underline focus:outline-none`}
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Show Less" : "Read More"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{createdat.toLocaleDateString()}</span>
          <span>{createdat.toLocaleTimeString()}</span>
          <button
            className={`flex items-center gap-1 text-xs font-medium transition-all ${
              upvoted ? "text-green-500" : "text-gray-400 hover:text-gray-600"
            }`}
            onClick={handleUpvote}
          >
            <ThumbsUp size={14} />
            {upvoteCount}
          </button>
        </div>
      </div>
    </div>
  );
};
