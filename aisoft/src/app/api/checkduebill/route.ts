import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    // const ThaiDate = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    try {
        const overdueBills = await prisma.bill.findMany({
            where: {
                due_date: { lt: new Date() },
                bill_status: "Unpaid",
            },
        });

        for (const bill of overdueBills) {
            await prisma.user.update({
                where: { user_id: bill.userid },
                data: { user_role: "ban" },
            });
        }

        return NextResponse.json({ message: "Bills checked" },{ status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Error checking bills" }, { status: 500 });
    }
}
