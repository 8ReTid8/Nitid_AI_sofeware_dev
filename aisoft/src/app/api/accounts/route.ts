import { authSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await authSession();
    
    try {
        const body = await req.json();
        console.log(body)
        const { mt5Id, name, currency, model, volume, token } = body;

        if (!mt5Id || !name || !currency || !model || !volume || !token) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const newAccount = await prisma.mT5_Acc.create({
            data: {
                acc_name: name,
                MT5_id: mt5Id,
                token: token,
                status: "off",
                lot_size: Number(volume), // Ensure lot_size is a Float
                modelid: model,
                userid: session?.user.id || "null"// Use null if user ID is undefined
            },
        });

        return NextResponse.json(newAccount, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
