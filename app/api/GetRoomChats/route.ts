// import { db } from "@repo/db/db";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(req:NextRequest) {
//     const session = await getServerSession()
//     if(!session?.user) {
//         return NextResponse.json({
//             msg:"Login into your account to get chats"
//         },{
//             status:203
//         })
//     }
//     try {
//         const {roomid} = await req.json();

//         const res = await db.room.findUnique({
//             where:{
//                 roomid:roomid
//             },
//             select:{
//                 doubts:{
//                     select:{
//                         userid: true,
//                         roomid: true,
//                         title: true,
//                         description: true,
//                         doubtid: true,
//                         timestamp:true,
//                         upvotes:{
//                             select:{
//                                 userid:true
//                             }
//                         },
//                         creator:{
//                             select:{
//                                 username:true
//                             }
//                         }
//                     }
//                 }
//             }
//         })
//         if(res?.doubts) {
//             return NextResponse.json({
//                 response:res.doubts
//             },{
//                 status:200
//             })
//         }
//         else {
//             return NextResponse.json({
//                 msg:"Sorry Roomid doent exist"
//             },{
//                 status:203
//             })
//         }

//     }catch(err) {
//         console.log("Prisma Error:", err);
//         return NextResponse.json({
//             msg:"Network Error"
//         },{
//             status:205
//         })

//     }
// }

import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req: NextRequest) {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json(
            { msg: "Login into your account to get chats" },
            { status: 203 }
        );
    }

    try {
        const { roomid, sortOrder } = await req.json();
        let doubts;
        if (sortOrder === "most-upvoted") {
            doubts = await db.doubt.findMany({
                where: { roomid },
                select: {
                    userid: true,
                    roomid: true,
                    title: true,
                    description: true,
                    doubtid: true,
                    timestamp: true,
                    upvotes: { select: { userid: true } }, // Get all upvotes
                    creator: { select: { username: true } },
                },
            });
            doubts.sort((a:any, b:any) => b.upvotes.length - a.upvotes.length);
        } else {
            doubts = await db.doubt.findMany({
                where: { roomid },
                orderBy: {
                    timestamp: sortOrder === "oldest" ? "asc" : "desc",
                },
                select: {
                    userid: true,
                    roomid: true,
                    title: true,
                    description: true,
                    doubtid: true,
                    timestamp: true,
                    upvotes: { select: { userid: true } },
                    creator: { select: { username: true } },
                },
            });
        }

        return NextResponse.json({ response: doubts }, { status: 200 });

    } catch (err) {
        console.log("Prisma Error:", err);
        return NextResponse.json({ msg: "Network Error" }, { status: 205 });
    }
}
