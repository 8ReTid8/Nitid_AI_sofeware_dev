import { authSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await authSession();
    
    try {
        const body = await req.json();
        console.log(body)
        console.log(session)
        const { mt5Id, name, currency, model, volume, token } = body;

        if (!mt5Id || !name || !currency || !model || !volume || !token) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const userid = await prisma.user.findFirst({
            where:{
                user_name: session?.user.name ?? undefined
            }
        })
        console.log(userid)
        const newAccount = await prisma.mT5_Acc.create({
            data: {
                acc_name: name,
                MT5_id: mt5Id,
                token: token,
                status: "off",
                lot_size: volume, // Ensure lot_size is a Float
                modelid: model,
                userid: userid?.user_id || "null" ,
                // acc_name: "w",
                // MT5_id: "w",
                // token: "w",
                // status: "off",
                // lot_size: "w", // Ensure lot_size is a Float
                // modelid: "04afd52c-e4d7-4b34-b067-9d8672ab24a2",
                // userid: session?.user.id || "null"
            },
        });

        return NextResponse.json(newAccount, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
