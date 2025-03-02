import { prisma } from "@/lib/db";
import { NextResponse } from "next/server"

export async function beforeCreateBillRoute(req: Request) {
    try{
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        if (!token) {
            throw new Error("Token is missing");
        }
        const mt5 = await prisma.mT5_Acc.findFirst({
            where: { token: token },
            select: { userid: true }
        });
        if (!mt5) {
            throw new Error("MT5 account not found");
        }
        const users = await prisma.user.findFirst({
            where: { user_id: mt5.userid },
            select:{user_last_bill_date:true}           
        })
        console.log(users)
        return NextResponse.json(users)
    }catch(error){
        console.log(error)
        return NextResponse.json({ error: `internal server: ${error}` }, { status: 500 })
    }
}
    