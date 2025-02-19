"use client";
import CheckOutpage from "@/components/payment/checkout";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("cant find stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
export default function Bot() {
    return (
        <div>
            <h1>Bot</h1>
            <div>
                <h1>TEST STRIPE</h1>
                <Elements stripe={stripePromise}
                    options={{
                        mode: "payment",
                        amount: 50 * 100,
                        currency: "usd"
                    }}
                >
                    <CheckOutpage amount={50 * 100} />
                </Elements>
            </div>
        </div>
    )
}