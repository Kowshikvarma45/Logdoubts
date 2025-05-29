import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();
        const {roomname} = await req.json()
        console.log("roomname : ", roomname)
        if (!session || !session.user || !session.user.email) {
            return NextResponse.json(
                { msg: "Login required to create a room" },
                { status: 203 }
            );
        }

        const user = await db.user.findUnique({
            where: { email: session.user.email },
            select: { userid: true }, 
        });

        if (!user) {
            return NextResponse.json(
                { msg: "User not found in database" },
                { status: 203 }
            );
        }

        const res = await db.room.create({
            data: { 
                creatorId: user.userid,
                roomname:roomname
            
            }, 
        });

        return NextResponse.json(
            { roomid: res.roomid },
            { status: 200 }
        );

    } catch (error) {
        console.error("CreateRoom Error:", error);
        return NextResponse.json(
            //@ts-expect-error
            { msg: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}
