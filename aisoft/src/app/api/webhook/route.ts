import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_PRIVATE_KEY!, {
    apiVersion: "2024-06-20" as any,
    typescript: true
});

export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.text();
    const signature = req.headers.get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!);

    } catch (error) {
        return new NextResponse("invalid signature", { status: 400 })
    }
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("✅ Payment Success!");
        console.log(paymentIntent)
        const updateBill = await prisma.bill.update({
            where:{
                bill_id: paymentIntent.metadata.billid
            },
            data:{
                bill_status: "Paid"
            }
        })
    }
    return new NextResponse("ok", { status: 200 })
}