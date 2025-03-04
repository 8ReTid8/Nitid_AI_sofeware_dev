'use client';
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutpage from "@/components/payment/checkout";
import Billhistory from "./billhistory";
import { useSession } from "next-auth/react";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("Cannot find Stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    const session = useSession()
    // const { data: session, status } = useSession();
    // const [bill, setBills] = useState("")
    const [selectedBill, setSelectedBill] = useState<any | null>(null);
    const [bills, setBills] = useState<any[]>([])
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBilldue = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getbilldue?userId=${session.data?.user.id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setBills(data);
                console.log(bills)

                // setBills(Array.isArray(data) ? data : []); 
            } catch (err: any) {
                setError(err.message || "Failed to fetch bill data.");
                // setBills([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBilldue();
    }, [session]);

   

    const handlePaymentClick = (bill: any) => {
        setSelectedBill(bill);
        setShowStripeForm(true);
    };

    return (
        <div className="min-h-screen bg-base-200 p-8">
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Bill Information Card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">Bill Details</h2>
                        <div className="divider"></div>

                        {loading ? (
                            <p className="text-center text-gray-500">Loading...</p>
                        ) : error ? (
                            <p className="text-center text-red-500">{error}</p>
                        ) : bills.length === 0 ? (
                            <p className="text-center text-gray-500">No bill available.</p>
                        ) : (
                            bills.map((bill, index) => (
                                <div key={index} className="flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <h3 className="text-xl font-semibold">
                                            {new Date(bill.create_date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </h3>
                                        <p className="mt-2">Amount: <span className="font-bold">{bill.bill_price}$</span></p>
                                        <div className="mt-2">
                                            Status:
                                            <span className={`ml-2 badge ${bill.bill_status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {bill.bill_status}
                                            </span>
                                        </div>
                                    </div>

                                    {!showStripeForm && bill.bill_status !== "Paid" && (
                                        <button className="btn btn-primary" onClick={() => handlePaymentClick(bill)}>
                                            Pay Now
                                        </button>
                                    )}
                                </div>
                            ))
                        )}

                        {/* Stripe Payment Form */}
                        {showStripeForm && selectedBill && (
                            <div className="mt-6">
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        mode: "payment",
                                        amount: selectedBill.bill_price * 100,
                                        currency: "usd"
                                    }}
                                >
                                    {session.data?.user.id && (
                                        <CheckOutpage amount={selectedBill.bill_price} sessionid={session.data.user.id} selectbill={selectedBill.bill_id} />
                                    )}
                                </Elements>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment History */}
                <Billhistory />
            </div>
        </div>
    );
}