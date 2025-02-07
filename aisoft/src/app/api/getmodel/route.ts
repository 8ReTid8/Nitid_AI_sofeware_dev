
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const currency = searchParams.get("currency");

        if (!currency) {
            return NextResponse.json({ error: "Currency is required" }, { status: 400 });
        }

        const models = await prisma.pPO_model.findMany({
            where: { model_currency: currency },
            select: { model_id: true, model_name: true }, // Select only necessary fields
        });

        return NextResponse.json(models);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}