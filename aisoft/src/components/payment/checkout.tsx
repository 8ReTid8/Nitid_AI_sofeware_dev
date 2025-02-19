"use client";
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

export default function CheckOutpage({ amount }: { amount: number }) {
    const stripe = useStripe();
    const element = useElements();

    const [errorMessage, setError] = useState<string>()
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        fetch("http://localhost:3000/api/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({amount:amount}),
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
    }, [amount])

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-2 rounded-md">
            {clientSecret && <PaymentElement />}
            {errorMessage&&<div>{errorMessage}</div>}
        </form>
    )
}