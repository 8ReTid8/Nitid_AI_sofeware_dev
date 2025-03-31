import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const requestData = await req.json();
        const { token, deals } = requestData;
        console.log('🔍 ค้นหาบัญชี MT5 จาก token:', token);
        console.log('📊 ดีลที่ได้รับ:', deals);
        // ค้นหา userId จาก token ในตาราง mt5account
        if(!token || !deals){
            return NextResponse.json({message: "no information send"},{status: 400})
        }
        const account = await prisma.mT5_Acc.findFirst({
            where: { token: token },
        });

        if (!account) {
            return NextResponse.json({ message: "Invalid token" }, { status: 400 });
        }

        const userId = account.userid;
        const mt5AccountId = account.MT5_id; // ✅ ดึง MT5_accountid
        console.log('สร้าง bills สำหรับ user id:', userId, 'บัญชี MT5:', mt5AccountId);

        if (!deals || deals.length === 0) {
            return NextResponse.json({ message: "No trade history available" });
        }

        const unpaidBillsCount = await prisma.bill.count({
            where: {
                accid: account.acc_id,
                bill_status: "Unpaid"
            }
        });
        console.log('📈 จำนวนบิลที่ค้างชำระ:', unpaidBillsCount);
        if (unpaidBillsCount >= 1) {
            return NextResponse.json({ message: "User need to pay last bill" });
        }

        // กรองเฉพาะดีลที่มีกำไร (profit > 0)
        const profitableDeals = deals.filter((deal: { profit: number }) => deal.profit > 0);
        const totalProfit = profitableDeals.reduce((sum: number, deal: { profit: number }) => sum + deal.profit, 0);
        const dealCount = profitableDeals.length;

        if (totalProfit === 0) {
            return NextResponse.json({ message: "No profitable trades, no bill created" });
        }

        // คิดค่าบริการ 5% ของกำไร
        let serviceFee = Number((totalProfit * 0.05));
        // let serviceFee = (totalProfit * 0.05).toFixed(2);
        // console.log('💰 ค่าบริการที่คำนวณได้:', serviceFee);
        if (serviceFee<0.1){
            serviceFee = 0.1
        }
        const newBill = await prisma.bill.create({
            data: {
                userid: account.userid,
                accid: account.acc_id,
                bill_price: serviceFee.toFixed(2),
                bill_status: "Unpaid",
                create_date: new Date(),
                due_date: new Date(new Date().setDate(new Date().getDate() + 2)),
            },
        });
        const updatedAccount = await prisma.mT5_Acc.update({
            where: { token: token },
            data: {
                last_bill_date: newBill.create_date,
            },
        });
        return NextResponse.json({ message: "Bill created successfully", bill: newBill });
    } catch (error) {
        console.error("Error creating bills:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}