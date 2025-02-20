"use client";
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

export default function CheckOutpage({ amount }: { amount: number }) {
    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setError] = useState<string>()
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: amount*100 }),
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
        if (!stripe || !elements) {
            return;
        }
        const { error: submitError } = await elements.submit()
        if (submitError) {
            setError(submitError.message)
            setLoading(false)
            return
        }
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                // return_url: `http://www.localhost:3000/payment-success?amount=${amount}`
                return_url:"http://localhost:3000"
            },
        })
        if (error) {
            setError(error.message)
        }
        else {

        }
        setLoading(false)
    }
    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                    role="status"
                >
                    <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                        Loading...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
            {clientSecret && <PaymentElement />}
            {errorMessage && <div>{errorMessage}</div>}
            <button
                disabled={!stripe || loading}
            >
                {!loading ? `Pay $${amount}` : "Processing..."}
            </button>
        </form>

    )
}