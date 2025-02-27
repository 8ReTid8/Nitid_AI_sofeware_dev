import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const mt5_id = url.searchParams.get("mt5_id");
    const token = url.searchParams.get("api_token");
    console.log(mt5_id, token)
    try {
        
        if (!mt5_id ) {
            return NextResponse.json({ message: "Missing mt5_id or token" }, { status: 400 });
        }
        // const acc = await prisma.mT5_Acc.findFirst({
        //     where: { MT5_id: mt5_id, token: token }
        // })
        // return NextResponse.json(acc, { status: 200 });
        const acc = await prisma.mT5_Acc.findFirst({
            where: { MT5_id: mt5_id },
            select: {
                model: {
                    select: {
                        model_name: true, // Only select the model name
                    },
                },
            },
        });

        // Check if the account was found
        if (!acc || !acc.model) {
            return NextResponse.json({ message: "Account or model not found" }, { status: 404 });
        }
        console.log(acc.model)
        return NextResponse.json(acc.model, { status: 200 }); 
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}