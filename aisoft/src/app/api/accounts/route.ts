import { authSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { DateTime } from "luxon";

export async function POST(req: Request) {
    const session = await authSession();
    // const lastBillDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    // console.log("Bangkok Time Stored:", lastBillDate);
    try {
        const body = await req.json();
        console.log(body)
        console.log(session)
        const { mt5Id, name, currency, model, volume, token } = body;

        if (!mt5Id || !name || !currency || !model || !volume || !token) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const userid = await prisma.user.findFirst({
            where: {
                user_name: session?.user.name ?? undefined
            }
        })
        console.log(userid)
        const newAccount = await prisma.mT5_Acc.create({
            data: {
                acc_name: name,
                MT5_id: mt5Id,
                token: token,
                status: "disconnect",
                lot_size: volume, // Ensure lot_size is a Float
                modelid: model,
                userid: userid?.user_id || "null",
                last_bill_date: new Date(),
            },
        });

        return NextResponse.json(newAccount, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
