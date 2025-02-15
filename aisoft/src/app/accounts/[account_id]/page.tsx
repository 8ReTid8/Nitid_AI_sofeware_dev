"use client";
// import { useEffect, useState } from "react";
// import Link from "next/link";

// type AccountDetails = {
//     acc_id: string;
//     acc_name: string;
//     status: string;
//     balance?: number;
//     transactions?: { time: string; price: string; profitLoss: string }[];
// };

// async function getAccountDetails(account_id: string) {
//     const response = await fetch(`http://localhost:3000/api/showaccount/${account_id}`);
//     if (!response.ok) {
//         throw new Error(`Failed to fetch account with ID ${account_id}`);
//     }
//     return response.json();
// }

// export default function AccountPage({ params }: { params: Promise<{ account_id: string }> }) {
//     const [account, setAccount] = useState<AccountDetails | null>(null);
//     const [error, setError] = useState<string | null>(null);
//     const [accountId, setAccountId] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchParams = async () => {
//             const { account_id } = await params; // Unwrapping the promise for `params`
//             setAccountId(account_id);
//         };

//         fetchParams();
//     }, [params]);

//     useEffect(() => {
//         const fetchAccount = async () => {
//             if (!accountId) return; // Wait until `accountId` is set
//             try {
//                 const accountData = await getAccountDetails(accountId);
//                 setAccount(accountData);
//             } catch (err: any) {
//                 setError(err.message || "Failed to fetch account details.");
//             }
//         };

//         fetchAccount();
//     }, [accountId]);

//     if (error) {
//         return <div className="text-center text-red-500 text-lg">Error: {error}</div>;
//     }

//     if (!account) {
//         return <div className="text-center text-gray-600 text-lg">Loading account details...</div>;
//     }

//     return (
//         <div className="min-h-screen bg-gray-100">

//             {/* Account Details Section */}
//             <main className="p-6 max-w-4xl mx-auto">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-4">{account.acc_name}</h1>

//                 <div className="flex items-center justify-between mb-6">
//                     <div className="text-4xl font-bold text-gray-800">
//                         {account.status === "connect" ? `$${account.balance || "N/A"}` : "N/A"}
//                     </div>
//                     <div className="flex space-x-4">
//                         <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">edit</button>
//                         <Link href="/account">
//                             <button className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded">back</button>
//                         </Link>
//                     </div>
//                 </div>

//                 {/* Transaction Table */}
//                 <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
//                     <table className="w-full table-auto">
//                         <thead className="bg-gray-200">
//                             <tr>
//                                 <th className="px-4 py-2 text-left text-gray-600">time</th>
//                                 <th className="px-4 py-2 text-left text-gray-600">price</th>
//                                 <th className="px-4 py-2 text-left text-gray-600">profit/loss</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {account.transactions?.map((transaction, index) => (
//                                 <tr key={index} className="border-t">
//                                     <td className="px-4 py-2">{transaction.time}</td>
//                                     <td className="px-4 py-2">{transaction.price}</td>
//                                     <td
//                                         className={`px-4 py-2 ${
//                                             parseFloat(transaction.profitLoss) >= 0
//                                                 ? "text-green-600"
//                                                 : "text-red-600"
//                                         }`}
//                                     >
//                                         {transaction.profitLoss}
//                                     </td>
//                                 </tr>
//                             )) || (
//                                 <tr>
//                                     <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
//                                         No transactions available.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex space-x-4">
//                     <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded">stop</button>
//                     <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded">delete</button>
//                 </div>
//             </main>
//         </div>
//     );
// }

import { useEffect, useState } from "react";

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
      const { account_id } = await params;
      setAccountId(account_id);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) return;
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
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-64"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-64 w-full"></div>
        </div>
      </div>
    );
  }

  const totalProfitLoss = account.transactions?.reduce((sum, transaction) => 
    sum + parseFloat(transaction.profitLoss), 0) || 0;

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{account.acc_name}</h1>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
              </svg>
            </button>
            <a href="/account" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content/60 text-sm">Current Balance</h2>
              <p className="text-2xl font-bold">
                {account.status === "connect" 
                  ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                      .format(account.balance || 0)
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content/60 text-sm">Total Profit/Loss</h2>
              <p className={`text-2xl font-bold ${totalProfitLoss >= 0 ? 'text-success' : 'text-error'}`}>
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
                  .format(totalProfitLoss)}
              </p>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Transaction History</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Price</th>
                    <th>Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {account.transactions?.length ? (
                    account.transactions.map((transaction, index) => (
                      <tr key={index}>
                        <td>{transaction.time}</td>
                        <td>{transaction.price}</td>
                        <td className={`flex items-center gap-2 ${
                          parseFloat(transaction.profitLoss) >= 0 ? 'text-success' : 'text-error'
                        }`}>
                          {parseFloat(transaction.profitLoss) >= 0 ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 7l5-5 5 5M7 17l5 5 5-5"/>
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M7 7l5 5 5-5M7 17l5-5 5 5"/>
                            </svg>
                          )}
                          {transaction.profitLoss}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center text-base-content/60">
                        No transactions available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button className="btn btn-primary gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M10 15l5-5"/>
              <path d="M9 9h6v6"/>
            </svg>
            Stop
          </button>
          <button className="btn btn-error gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
            </svg>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}