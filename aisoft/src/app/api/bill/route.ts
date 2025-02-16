import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json()
        console.log(body)
        const { accountId, totalProfit, month, year } = body;

        // if (!accountId || totalProfit === undefined || !month || !year) {
        //     return NextResponse.json({ error: "Account ID, totalProfit, month, and year are required" }, { status: 400 });
        // }

        // // Ensure the month is valid (1-12)
        // if (month < 1 || month > 12) {
        //     return NextResponse.json({ error: "Invalid month provided" }, { status: 400 });
        // }

        // // Check if a bill already exists for this month and year
        // const existingBill = await prisma.bill.findFirst({
        //     where: {
        //         accountId: accountId,
        //         month: month,
        //         year: year,
        //     },
        // });

        // if (existingBill) {
        //     return NextResponse.json({ error: "Bill for this month already exists" }, { status: 400 });
        // }

        // // Calculate the 5% fee
        // const fee = totalProfit * 0.05;

        // // Create a new bill
        // const newBill = await prisma.bill.create({
        //     data: {
        //         accountId: accountId,
        //         month: month,
        //         year: year,
        //         totalProfit: totalProfit,
        //         fee: fee,
        //         paid: false,
        //     },
        // });

        // return NextResponse.json(newBill, { status: 201 });
        return NextResponse.json({ status: 201 });

    } catch (error) {
        console.error("Error creating bill:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}