"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type AccountDetails = {
    acc_id: string;
    acc_name: string;
    status: string;
    balance?: number;
    transactions?: { time: string; price: string; profitLoss: string }[];
};

async function getAccountDetails(account_id: string) {
    const response = await fetch(`http://localhost:3000/api/showaccount/${account_id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch account with ID ${account_id}`);
    }
    return response.json();
}

export default function AccountPage({ params }: { params: Promise<{ account_id: string }> }) {
    const [account, setAccount] = useState<AccountDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [accountId, setAccountId] = useState<string | null>(null);

    useEffect(() => {
        const fetchParams = async () => {
            const { account_id } = await params; // Unwrapping the promise for `params`
            setAccountId(account_id);
        };

        fetchParams();
    }, [params]);

    useEffect(() => {
        const fetchAccount = async () => {
            if (!accountId) return; // Wait until `accountId` is set
            try {
                const accountData = await getAccountDetails(accountId);
                setAccount(accountData);
            } catch (err: any) {
                setError(err.message || "Failed to fetch account details.");
            }
        };

        fetchAccount();
    }, [accountId]);

    if (error) {
        return <div className="text-center text-red-500 text-lg">Error: {error}</div>;
    }

    if (!account) {
        return <div className="text-center text-gray-600 text-lg">Loading account details...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">

            {/* Account Details Section */}
            <main className="p-6 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">{account.acc_name}</h1>

                <div className="flex items-center justify-between mb-6">
                    <div className="text-4xl font-bold text-gray-800">
                        {account.status === "connect" ? `$${account.balance || "N/A"}` : "N/A"}
                    </div>
                    <div className="flex space-x-4">
                        <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">edit</button>
                        <Link href="/account">
                            <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">back</button>
                        </Link>
                    </div>
                </div>

                {/* Transaction Table */}
                <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
                    <table className="w-full table-auto">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="px-4 py-2 text-left text-gray-600">time</th>
                                <th className="px-4 py-2 text-left text-gray-600">price</th>
                                <th className="px-4 py-2 text-left text-gray-600">profit/loss</th>
                            </tr>
                        </thead>
                        <tbody>
                            {account.transactions?.map((transaction, index) => (
                                <tr key={index} className="border-t">
                                    <td className="px-4 py-2">{transaction.time}</td>
                                    <td className="px-4 py-2">{transaction.price}</td>
                                    <td
                                        className={`px-4 py-2 ${
                                            parseFloat(transaction.profitLoss) >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {transaction.profitLoss}
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                                        No transactions available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">stop</button>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">delete</button>
                </div>
            </main>
        </div>
    );
}
