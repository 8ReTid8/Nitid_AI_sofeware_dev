import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { account_id: string } }) {
    try {
        const account = await prisma.mT5_Acc.findFirst({
            where: { acc_id: params.account_id },
        });

        if (!account) {
            return NextResponse.json({ error: "Account not found" }, { status: 404 });
        }

        return NextResponse.json(account, { status: 200 });
    } catch (error) {
        console.error("Error fetching account:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
