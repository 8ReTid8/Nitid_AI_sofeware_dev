import React, { useEffect, useState } from "react";

export default function ShowAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch accounts data from the API
    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/getaccount"); // Call your API route
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setAccounts(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch accounts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if (loading) return <div>Loading accounts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
                {accounts.map((account: any) => (
                    <div
                        key={account.acc_id}
                        className="border rounded-lg p-4 shadow-md bg-gray-100"
                    >
                        <div className="text-lg font-semibold">{account.acc_name}</div>
                        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
                            View
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}