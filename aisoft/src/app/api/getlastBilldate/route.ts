import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const api_token = url.searchParams.get("api_token");
    try {
        if (!api_token) {
            return NextResponse.json(
                { error: 'API token is required' },
                { status: 400 }
            );
        }

        const lastBillDate = await prisma.mT5_Acc.findFirst({
            where: {
                token: api_token
            },
            select: {
                last_bill_date: true
            }
        });
        if (!lastBillDate?.last_bill_date) {
            return NextResponse.json(
                { error: 'Last bill date not found' },
                { status: 404 }
            );
        }
        const lastBillDateUTC = new Date(lastBillDate.last_bill_date);
        const lastBillDateMT5 = new Date(lastBillDateUTC.getTime() + 3 * 60 * 60 * 1000);
        console.log(lastBillDateMT5)
        return NextResponse.json({ last_billed: lastBillDateMT5 });
        // return NextResponse.json({ last_billed: lastBillDate?.last_bill_date })

    } catch (error) {
        console.error('Error fetching last bill date:', error);
        return NextResponse.json(
            { error: 'Failed to fetch last bill date' },
            { status: 500 }
        );
    }
}