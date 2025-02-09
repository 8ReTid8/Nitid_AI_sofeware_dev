// import React, { useEffect, useState } from "react";

// export default function ShowAccounts() {
//     const [accounts, setAccounts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     // Fetch accounts data from the API
//     useEffect(() => {
//         const fetchAccounts = async () => {
//             try {
//                 const response = await fetch("http://localhost:3000/api/getaccount"); // Call your API route
//                 if (!response.ok) {
//                     throw new Error(`Error: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setAccounts(data);
//             } catch (err: any) {
//                 setError(err.message || "Failed to fetch accounts.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAccounts();
//     }, []);

//     if (loading) return <div>Loading accounts...</div>;
//     if (error) return <div>Error: {error}</div>;

//     return (
//         <div className="p-6">
//             <div className="grid grid-cols-2 gap-4">
//                 {accounts.map((account: any) => (
//                     <div
//                         key={account.acc_id}
//                         className="border rounded-lg p-4 shadow-md bg-gray-100"
//                     >
//                         <div className="text-lg font-semibold">{account.acc_name}</div>
//                         <div className="text-lg font-semibold">{account.status}</div>
//                         <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
//                             View
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function ShowAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/getaccount");
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

    if (loading) return <div className="text-center text-gray-600 text-lg">Loading accounts...</div>;
    if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map((account: any) => (
                    <div key={account.acc_id} className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                        <div className="text-xl font-semibold text-gray-800 mb-2">{account.acc_name}</div>
                        <div className={`text-sm font-medium ${account.status === 'connect' ? 'text-green-600' : 'text-red-600'}`}>Status: {account.status}</div>
                        <Link href={`/account/${account.acc_id}`}>
                            <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">View</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
