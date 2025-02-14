import { prisma } from "@/lib/db"
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log(body)
        const { token, mt5_id, action, balance } = body
        const mt5_ids = String(mt5_id)
        const verify = await prisma.mT5_Acc.findFirst({
            where: {
                MT5_id: mt5_ids,
                token: token,
            }
        })
        if (!verify) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const connect = await prisma.mT5_Acc.update({
            where: {
                MT5_id: mt5_ids,
            },
            data: {
                status: action,
                balance: balance
            }
        })
        return NextResponse.json({ message: "Success", connect}, { status: 200 });
    } catch (error) {
        console.error("Error processing request:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}