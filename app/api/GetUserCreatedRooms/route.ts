import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req:NextRequest) {

    try {
        const {userid} = await req.json();

        const response = await db.user.findUnique({
            where:{
                userid:userid
            },
            select:{
                createdRooms:true
            }
        })
        if(!response)  {
            return NextResponse.json({
                msg:"Sorry No Room exist for the given Roomid"
            },{
                status:203
            })
        }
        else {
        return NextResponse.json({
            createdrooms:response.createdRooms
        },{
            status:200
        })
        }


    }catch(err) {
        console.log("Prisma Error:", err);
        return NextResponse.json({
            msg:"check the internet connection"
        },{
            status:500
        })
    }

}