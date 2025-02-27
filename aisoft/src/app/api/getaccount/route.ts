import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";


export async function GET(req:Request) {

    const url = new URL(req.url);
    const user_id = url.searchParams.get("userId");

    try {
        const list = await prisma.mT5_Acc.findMany({
            where: { userid: user_id ?? undefined},
            include: {
                model: true,
            }
        });

        return NextResponse.json(list, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}