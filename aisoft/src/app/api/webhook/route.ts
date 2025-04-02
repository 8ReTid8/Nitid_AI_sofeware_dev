import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
//     apiVersion: "2024-06-20" as any,
//     typescript: true
// });

export async function POST(req: NextRequest) {
    const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
        apiVersion: "2024-06-20" as any,
        typescript: true
    });

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

    } catch (error) {
        console.log(`❌ Error message webhook : ${error}`);
        return new NextResponse("invalid signature", { status: 400 })
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment Success!");
        console.log(paymentIntent)

        const selectbill = await prisma.bill.findFirst({
            where: {
                bill_id: paymentIntent.metadata.billid
            }
        })
        
        if(!selectbill) {
            return new NextResponse("Bill not found", { status: 404 })
        }
        
        if (selectbill.due_date < new Date()) {
            const userpayment = await prisma.user.findFirst({
                where: {
                    user_id: paymentIntent.metadata.userId
                }
            })
            if (userpayment?.user_role == "ban") {
                const updateUser = await prisma.user.update({
                    where: {
                        user_id: paymentIntent.metadata.userId
                    },
                    data: {
                        user_role: "user"
                    }
                })
            }
        }

        const updateBill = await prisma.bill.update({
            where: {
                bill_id: paymentIntent.metadata.billid
            },
            data: {
                bill_status: "Paid"
            }
        })


    }
    return new NextResponse("ok", { status: 200 })
}