'use client';
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckOutpage from "@/components/payment/checkout";
import Billhistory from "./billhistory";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
    throw new Error("Cannot find Stripe public key");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
    const [currentMonth, setCurrentMonth] = useState("");
    const [billStatus, setBillStatus] = useState({
        status: "Unpaid",
        isPaid: false,
    });
    const [showStripeForm, setShowStripeForm] = useState(false);
    const [paymentHistory, setPaymentHistory] = useState([
        { month: "January 2025", status: "Paid" },
        { month: "February 2025", status: "Unpaid" },
    ]);

    useEffect(() => {
        const month = dayjs().format("MMMM YYYY");
        setCurrentMonth(month);
    }, []);

    const handlePaymentClick = () => {
        setShowStripeForm(true);
    };

    const handlePaymentSuccess = () => {
        setBillStatus({
            status: "Paid",
            isPaid: true,
        });

        setPaymentHistory((prevHistory) => [
            { month: currentMonth, status: "Paid" },
            ...prevHistory.filter((record) => record.month !== currentMonth),
        ]);

        setShowStripeForm(false);

        const toastElement = document.getElementById('payment-toast');
        if (toastElement) {
            toastElement.classList.remove('hidden');
        }
        setTimeout(() => {
            if (toastElement) {
                toastElement.classList.add('hidden');
            }
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-base-200 p-8">
            {/* Toast notification */}
            <div id="payment-toast" className="toast toast-top toast-end hidden">
                <div className="alert alert-success">
                    <span>Payment successful!</span>
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Current Month Card */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">BILLS</h2>
                        <div className="divider"></div>

                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-xl font-semibold">{currentMonth}</h3>
                                <div className="mt-2">
                                    Status:
                                    <span className={`ml-2 badge ${billStatus.isPaid ? 'badge-success' : 'badge-warning'
                                        }`}>
                                        {billStatus.status}
                                    </span>
                                </div>
                            </div>

                            {!showStripeForm && (
                                <button
                                    className={`btn btn-primary ${billStatus.isPaid ? 'btn-disabled' : ''}`}
                                    onClick={handlePaymentClick}
                                    disabled={billStatus.isPaid}
                                >
                                    {billStatus.isPaid ? (
                                        <>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Paid
                                        </>
                                    ) : (
                                        'Pay Now'
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Stripe Payment Form */}
                        {showStripeForm && (
                            <div className="mt-6">
                                <Elements
                                    stripe={stripePromise}
                                    options={{
                                        mode: "payment",
                                        amount: 50 * 100,
                                        currency: "usd"
                                    }}
                                >
                                    {/* <CheckOutpage amount={50} onSuccess={handlePaymentSuccess} /> */}
                                    <CheckOutpage amount={50} />
                                </Elements>
                            </div>
                        )}
                    </div>
                </div>

                {/* Payment History Card */}
                <Billhistory/>
                {/* <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title text-2xl font-bold">Payment History</h2>
                        <div className="divider"></div>

                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Month</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paymentHistory.map((record, index) => (
                                        <tr key={index}>
                                            <td>{record.month}</td>
                                            <td>
                                                <span className={`badge ${record.status === 'Paid' ? 'badge-success' : 'badge-warning'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>  */}
            </div>
        </div>
    );
}