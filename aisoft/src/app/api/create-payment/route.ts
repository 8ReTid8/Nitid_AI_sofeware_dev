import { NextResponse } from "next/server"

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
export async function POST(req:Request){
    try{
        const {amount} = await req.json()
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: "",
            automatic_payment_methods:{enabled:true}
        })
        return NextResponse.json({clientSecret:paymentIntent.client_secret})
    }catch(error){
        console.log(error)
        return NextResponse.json({error:`internal server: ${error}`},{status:500})
    }
}