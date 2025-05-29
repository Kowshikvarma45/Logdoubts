import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient()
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        let updatedDoubt;

        if (body.insert === true) {
            updatedDoubt = await db.doubt.update({
                where: { doubtid: body.doubtid },
                data: { upvotes: { connect: { userid: body.userid } } },
                include: { upvotes: {select:{userid:true}} }
            });
        } else {
            updatedDoubt = await db.doubt.update({
                where: { doubtid: body.doubtid },
                data: { upvotes: { disconnect: { userid: body.userid } } },
                include: { upvotes: {select:{userid:true}} }
            });
        }

        // console.log("updated doubt: ",updatedDoubt)
        // console.log(updatedDoubt)
        return NextResponse.json({
             success: true, upvotes: updatedDoubt.upvotes
            },
            {
            status:200
            })
    } catch (err) {
        console.log("error : ",err)
        return NextResponse.json({
            msg:"sorry some error occured view in console"
        },{
            status:205
        })
    }
}
