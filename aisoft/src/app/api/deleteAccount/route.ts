import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();
    console.log(body)
    const { accountId } = body;
    if (!accountId) {
        return NextResponse.json({ message: "Account ID is required" }, { status: 400 });
    }

    try {
        console.log(`Deleting account with ID: ${accountId}`);
        const deletedAccount = await prisma.mT5_Acc.delete({
            where: {
                acc_id: accountId,
            },
        });
        return NextResponse.json({ message: "Account deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting account:", error);
        return NextResponse.json({ message: "Error deleting account" }, { status: 500 });
    }
}