// import { useEffect, useState } from "react";

// export default function Billhistory() {
//     const [bills, setBills] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     useEffect(() => {
//         const fetchBillhistory = async () => {
//             try {
//                 const response = await fetch("http://localhost:3000/api/getbillhistory");
//                 if (!response.ok) {
//                     throw new Error(`Error: ${response.status}`);
//                 }
//                 const data = await response.json();
//                 setBills(data);
//                 console.log(data)
//             } catch (err: any) {
//                 setError(err.message || "Failed to fetch accounts.");
//             } finally {
//                 setLoading(false);
//             }
//         };
//         console.log(bills)
//         fetchBillhistory();
//     }, []);

//     return (
//         /* Payment History Card */
//         <div className="card bg-base-100 shadow-xl">
//             <div className="card-body">
//                 <h2 className="card-title text-2xl font-bold">Payment History</h2>
//                 <div className="divider"></div>

                
//                 <div className="overflow-x-auto">
//                     <table className="table table-zebra w-full">
//                         <thead>
//                             <tr>
//                                 <th>Account</th>
//                                 <th>Date</th>
//                                 <th>Amount</th>
//                                 <th>Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {bills.map((record: any, index) => (
//                                 <tr key={index}>
//                                     <td>{record.from_bot}</td>
//                                     {/* <td>{record.created_at}</td> */}
//                                     <td>{new Date(record.created_at).toLocaleString("en-US", {
//                                         timeZone: "Asia/Bangkok",
//                                         year: "numeric",
//                                         month: "long",
//                                         day: "numeric",
//                                         // hour: "2-digit",
//                                         // minute: "2-digit",
//                                         // second: "2-digit",
//                                         hour12: false,
//                                     })}</td>
//                                     <td>{`${record.bill_price}$`}</td>
//                                     <td>
//                                         <span className={`badge ${record.bill_status === 'Paid' ? 'badge-success' : 'badge-warning'
//                                             }`}>
//                                             {record.bill_status}
//                                         </span>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }

import { authSession } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Billhistory() {
    const [bills, setBills] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const session = useSession();
    console.log(session)
    console.log(session.data?.user)
    useEffect(() => {
        const fetchBillhistory = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/getbillhistory?userId=${session.data?.user.id}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                
                // Ensure data is an array before setting state
                setBills(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message || "Failed to fetch bill history.");
            } finally {
                setLoading(false);
            }
        };

        fetchBillhistory();
    }, [session]);

    return (
        <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
                <h2 className="card-title text-2xl font-bold">Payment History</h2>
                <div className="divider"></div>

                {loading ? (
                    <p className="text-center text-gray-500">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : bills.length === 0 ? (
                    <p className="text-center text-gray-500">No payment history available.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                            <thead>
                                <tr>
                                    <th>Account</th>
                                    <th>Date</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bills.map((record: any, index) => (
                                    <tr key={index}>
                                        <td>{record.from_bot || "Unknown"}</td>
                                        <td>{record.created_at ? new Date(record.created_at).toLocaleString("en-US", {
                                            timeZone: "Asia/Bangkok",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour12: false,
                                        }) : "N/A"}</td>
                                        <td>{record.bill_price ? `${record.bill_price}$` : "N/A"}</td>
                                        <td>
                                            <span className={`badge ${record.bill_status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                                                {record.bill_status || "Pending"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
