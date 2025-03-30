import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        // const {account_id} = context.params

        const url = new URL(req.url);
        const account_id = url.searchParams.get("account_id");
        if (!account_id) {
            return NextResponse.json({ error: "Account ID is required" }, { status: 400 });
        }
        const account = await prisma.mT5_Acc.findFirst({
            where: { acc_id: account_id },
            include: {
                model: true,
            },
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
