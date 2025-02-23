import { NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY)
export async function POST(req: Request) {
    try {
        const { amount, sessionid, selectbill } = await req.json()
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "usd",
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: sessionid,
                billid: selectbill,
            }
        })
        return NextResponse.json({ clientSecret: paymentIntent.client_secret })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: `internal server: ${error}` }, { status: 500 })
    }
}