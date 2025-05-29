import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req:NextRequest) {
    try {
        const {email,password} = await req.json();
        const res = await db.user.findUnique({
            where:{
                email:email
            }
        })
        if(res) {
            if(password == res.password) {
                return NextResponse.json({
                    userid:res.userid,
                    username:res.username,
                    email:email,
                    password:password
                },{
                    status:200
                })
            }
            else {
                return NextResponse.json({
                    msg:"Incorrect password for the given mail id"
                },{
                    status:201
                })
            }
        }
        else {
            return NextResponse.json({
                msg:"Sorry no user found with the given credentials"
            },{
                status:201
            })
        }
    }catch(err) {
        return NextResponse.json({
            msg:"check your internet connection",
            err:err
        },{
            status:500
        })
    } 
}