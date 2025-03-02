import { authSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    try {
        const body = await req.json();
        console.log(body)
        const { mt5Id, name, currency, model, volume, acc_id } = body;

        if (!mt5Id || !name || !currency || !model || !volume || !acc_id) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }


        const updateAccount = await prisma.mT5_Acc.update({
            where: {
                acc_id: acc_id,
            },
            data: {
                acc_name: name,
                MT5_id: mt5Id,
                lot_size: volume, // Ensure lot_size is a Float
                modelid: model,
            },
        });

        return NextResponse.json(updateAccount, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
