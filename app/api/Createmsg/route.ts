import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req:NextRequest) {
    const session = await getServerSession()
    if(!session?.user?.email) {
        return NextResponse.json({
            msg:"Login to send/create a message"
        },{
            status:203
        })
    }
    try {
        
        const body = await req.json();

        const res = await db.doubt.create({
            data:{
                userid:body.userid,
                roomid:body.roomid,
                title:body.title,
                description:body.description,
                timestamp:body.timestamp
            },
            select:{
                doubtid:true,
                userid:true,
                roomid:true,
                title:true,
                description:true,
                upvotes:true,
                timestamp:true
            }
        })

        if(res) {
            return NextResponse.json(res,{
                status:200
            })
        }
        else {
            return NextResponse.json({
                msg:"please check the internet connect"
            },{
                status:203
            })
        }
    }catch(err) {
        console.log("Prisma Error:", err);
        return NextResponse.json({
            msg:"please check the internet connection"
        },{
            status:203
        })

    }
}