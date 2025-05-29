import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req: NextRequest) {
    try {
        if(!req.body) {
            return NextResponse.json({
                msg:"no body defined"
            })
        }
        const data = await req.json();

        if (!data.roomid) {
            return NextResponse.json(
                { msg: "Room ID is required" },
                { status: 203 }
            );
        }

        const roomid = data.roomid;

        const response = await db.room.findUnique({
            where: { roomid },
            select:{
                roomid:true,
                roomname:true
            }
        });
        if (response) {
            return NextResponse.json(
                {
                    roomname: response.roomname,
                    roomid:roomid
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                { msg: "No room ID found" },
                { status: 202 } 
            );
        }
    } catch (err) {
        console.log("Prisma Error:", err);
        return NextResponse.json(
            { msg: "Please check the Internet connection" },
            { status: 500 }
        );
    }
}
