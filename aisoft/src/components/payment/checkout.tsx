"use client";
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';

export default function CheckOutpage({ amount, sessionid, selectbill }: { amount: number, sessionid: string, selectbill: string }) {
    // export default function CheckOutpage({ amount }: { amount: number}) {

    const stripe = useStripe();
    const elements = useElements();

    const [errorMessage, setError] = useState<string>();
    const [clientSecret, setClientSecret] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch("http://localhost:3000/api/create-payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ amount: amount * 100, sessionid: sessionid, selectbill: selectbill },),
        })
            .then(res => res.json())
            .then(data => setClientSecret(data.clientSecret))
    }, [amount]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);
        if (!stripe || !elements) {
            return;
        }
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message);
            setLoading(false);
            return;
        }
        const { error } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: "http://localhost:3000/payment"
            },
        });
        if (error) {
            setError(error.message);
        }
        setLoading(false);
    };

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="min-h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="loading loading-spinner loading-lg text-primary"></div>
                    <p className="text-base-content/70">Preparing payment form...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title text-2xl mb-6">Secure Payment</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Payment Summary */}
                        <div className="bg-base-200 p-4 rounded-lg mb-6">
                            <div className="flex justify-between items-center">
                                <span className="text-base-content/70">Amount to pay</span>
                                <span className="text-xl font-semibold">${amount}</span>
                            </div>
                        </div>

                        {/* Payment Element */}
                        <div className="bg-white rounded-lg overflow-hidden">
                            {clientSecret && <PaymentElement />}
                        </div>

                        {/* Error Message */}
                        {errorMessage && (
                            <div className="alert alert-error">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{errorMessage}</span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!stripe || loading}
                            className="btn btn-primary w-full"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    Pay ${amount}
                                </>
                            )}
                        </button>

                        {/* Security Notice */}
                        <div className="text-center text-sm text-base-content/70">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Secure payment powered by Stripe
                            </div>
                            <p>Your payment information is encrypted and secure</p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}