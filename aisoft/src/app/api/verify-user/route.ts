import { prisma } from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const mt5_id = url.searchParams.get("mt5_id");
    const token = url.searchParams.get("api_token");

    try {
        if (!mt5_id || !token) {
            return NextResponse.json({ message: "Missing mt5_id or token" }, { status: 400 });
        }
        const verify = await prisma.mT5_Acc.findFirst({
            where: {
                MT5_id: mt5_id,
                token: token,
            },
            include: {
                user: true
            }
        })
        if (!verify) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }
        if(verify.user.user_role === 'ban'){
            return NextResponse.json({ error: "User is banned" }, { status: 401 });
        }
        // const connect = await prisma.mT5_Acc.update({
        //     where: {
        //         MT5_id: mt5_ids,
        //     },
        //     data: {
        //         status: action
        //     }
        // })
        return NextResponse.json({ message: "CLEAN"}, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}