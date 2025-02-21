import { authSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("userId");
    console.log(user_id)
    try {
        const bill = await prisma.bill.findMany({
            where: {
                userid: user_id ?? undefined,
                bill_status: "Unpaid"
            }
        })
        return NextResponse.json(bill, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}