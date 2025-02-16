'use client';
import { useState } from "react";

export default function Showbill() {
    const [selectedBill, setSelectedBill] = useState(null);

    // Sample bills data - in real app, this would come from API
    const bills = [
        { id: 1, description: 'Monthly Subscription', amount: 29.99, dueDate: '2025-03-01' },
        { id: 2, description: 'Premium Features', amount: 49.99, dueDate: '2025-03-15' },
        { id: 3, description: 'Additional Services', amount: 19.99, dueDate: '2025-03-10' }
    ];

    const handleBillSelect = (bills) => {
        setSelectedBill(bills);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <div className="container mx-auto p-4 max-w-6xl">

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Bills Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Outstanding Bills
                        </h2>
                        <div className="space-y-4">
                            {bills.map(bill => (
                                <div
                                    key={bill.id}
                                    className={`card bg-base-100 cursor-pointer transition-all hover:bg-base-200 ${selectedBill?.id === bill.id ? 'border-2 border-primary' : 'border border-base-300'
                                        }`}
                                    onClick={() => handleBillSelect(bill)}
                                >
                                    <div className="card-body p-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium">{bill.description}</h3>
                                                <p className="text-sm opacity-70">Due: {bill.dueDate}</p>
                                            </div>
                                            <span className="font-semibold">{formatCurrency(bill.amount)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Payment Details Section */}
                <div className="card bg-base-100 shadow-xl">
                    <div className="card-body">
                        <h2 className="card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Payment Details
                        </h2>
                        {selectedBill ? (
                            <div className="space-y-4">
                                <div className="bg-base-200 p-4 rounded-box">
                                    <h3 className="font-medium mb-2">Summary</h3>
                                    <div className="flex justify-between mb-2">
                                        <span>Description:</span>
                                        <span>{selectedBill.description}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span>Due Date:</span>
                                        <span>{selectedBill.dueDate}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total Amount:</span>
                                        <span>{formatCurrency(selectedBill.amount)}</span>
                                    </div>
                                </div>

                                {/* Payment Method Selection */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text">Select Payment Method</span>
                                    </label>
                                    <select className="select select-bordered w-full">
                                        <option disabled selected>Choose payment method</option>
                                        <option>Credit Card</option>
                                        <option>Debit Card</option>
                                        <option>Bank Transfer</option>
                                    </select>
                                </div>

                                <button className="btn btn-primary w-full">
                                    Pay {formatCurrency(selectedBill.amount)}
                                </button>
                            </div>
                        ) : (
                            <div className="text-center opacity-70 py-8">
                                Select a bill to view payment details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
