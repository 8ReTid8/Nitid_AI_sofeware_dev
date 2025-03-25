import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {    
    try {
        const body = await req.json();
        console.log(body)
        const { name, currency, version, winrate,profitfactor,drawdown } = body;

        if (!version || !name || !currency || !winrate || !profitfactor || !drawdown) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }
        const newModel = await prisma.pPO_model.create({
            data: {
                model_name: name,
                model_version: String(version),
                model_currency: currency,
                model_winrate: winrate,
                model_profit_factor: profitfactor,
                model_drawdown: drawdown,
            },
        });
      

        return NextResponse.json(newModel, { status: 201 });
    } catch (error) {
        console.error("Error creating account:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
