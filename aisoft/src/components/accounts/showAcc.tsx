// import React, { useEffect, useState } from "react";
// import Link from "next/link";

// export default function ShowAccounts() {
//     const [accounts, setAccounts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchAccounts = async () => {
//             try {
//                 const response = await fetch("http://localhost:3000/api/getaccount");
//                 // console.log(response.balance)
//                 if (!response.ok) {
//                     throw new Error(`Error: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 console.log(data)
//                 setAccounts(data);
//             } catch (err: any) {
//                 setError(err.message || "Failed to fetch accounts.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchAccounts();
//     }, []);

//     if (loading) return <div className="text-center text-gray-600 text-lg">Loading accounts...</div>;
//     if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

//     return (
//         <div className="p-6 max-w-5xl mx-auto">
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {accounts.map((account: any) => (
//                     <div key={account.acc_id} className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
//                         <div className="text-xl font-semibold text-gray-800 mb-2">{account.acc_name}</div>
//                         <div className={`text-sm font-medium ${account.status === 'connect' ? 'text-green-600' : 'text-red-600'}`}>Status: {account.status}</div>
//                         {/* <div className={`text-sm font-medium `}>Balance: {account.balance}</div> */}
//                         {account.status === 'connect' && (
//                             <div className="text-sm font-medium text-gray-700">
//                                 Balance: {account.balance || "N/A"}
//                             </div>
//                         )}
//                         <Link href={`/accounts/${account.acc_id}`}>
//                             <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">View</button>
//                         </Link>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import { useEffect, useState } from "react";

export default function ShowAccounts() {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/getaccount");
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setAccounts(data);
            } catch (err:any) {
                setError(err.message || "Failed to fetch accounts.");
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-base-200 p-6 flex items-center justify-center">
                <div className="alert alert-error max-w-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Error: {error}</span>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6 max-w-5xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <div className="skeleton h-4 w-28 mb-4"></div>
                                <div className="skeleton h-4 w-20 mb-2"></div>
                                <div className="skeleton h-4 w-24 mb-4"></div>
                                <div className="skeleton h-10 w-full"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-200 p-6">
            <div className="max-w-5xl mx-auto">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {accounts.map((account: any) => (
                        <div key={account.acc_id} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                            <div className="card-body">
                                <h2 className="card-title text-xl">{account.acc_name}</h2>
                                
                                <div className="flex flex-col gap-2 my-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`badge badge-lg ${
                                            account.status === 'connect' ? 'badge-success' : 'badge-error'
                                        }`}>
                                            {account.status}
                                        </div>
                                    </div>
                                    
                                    {account.status === 'connect' && (
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-base-content/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="font-medium">
                                                {new Intl.NumberFormat('en-US', { 
                                                    style: 'currency', 
                                                    currency: 'USD' 
                                                }).format(account.balance || 0)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="card-actions justify-end mt-2">
                                    <a href={`/accounts/${account.acc_id}`} className="btn btn-primary w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        View Details
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}