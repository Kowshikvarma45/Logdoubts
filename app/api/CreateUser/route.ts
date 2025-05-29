import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req:NextRequest) {

    try {
        const info = await req.json();
        const usernamecheck = await db.user.findUnique({
            where:{
                username:info.username
            }
        })
        if(usernamecheck == null) {
            const emailcheck = await db.user.findUnique({
                where:{
                    email:info.email
                }
            })
            if(emailcheck == null) {
                const res = await db.user.create({
                    data:{
                        username:info.username,
                        email:info.email,
                        password:info.password
                    }
                })
                if(res?.userid) {
                    return NextResponse.json({
                        response:res
                    },{
                        status:200
                    })
                }
                else {
                    return NextResponse.json({
                        msg:"Sorry server is busy please try again after some time"
                    },{
                        status:204
                    })
                }

            }else {
                return NextResponse.json({
                    msg:"Email id already exist,try to signin"
                },{
                    status:201
                })
            }

        }else {
            return NextResponse.json({
                msg:"Username Already Exist,try another one"
            },{
                status:201
            })
        }
    }catch(err) {
        console.log("Prisma Error:", err);
        return NextResponse.json({
            msg:"Please check your Internet connection"
        },{
            status:404
        })
    }

}