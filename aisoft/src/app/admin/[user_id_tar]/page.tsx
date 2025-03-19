// import { DeleteUser } from '@/app/api/admin/getUser';
// import { DelUser } from '@/components/admin/deleteUserButton';
// import { notFound, useRouter } from 'next/navigation'

// interface User {
//   user_id: string;
//   user_name: string;
//   user_email: string;
//   user_role: string;
//   mt5_accounts?: MT5Account[];
//   bill?: Bill[];
// }

// interface MT5Account {
//   acc_id: string
//   acc_name: string
//   status: string
//   token: string
// }

// interface Bill {
//   bill_id: string;
//   create_date: string;
//   bill_status: string
//   bill_price: string
//   mt5_account: MT5Account
//   accid: string
// }

// async function getUserData(user_id: string) {
//   try {
//     const res = await fetch(`http://localhost:3000/api/users?userId=${user_id}`, { cache: 'no-store' })
//     if (!res.ok) return null
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching user:', error)
//     return null
//   }
// }

// export default async function UserDetailPage({ params }: { params: Promise<{ user_id_tar: string }> }) {
//   const { user_id_tar } = await params;
//   const user = await getUserData(user_id_tar)
//   // const router = useRouter()
//   if (!user) {
//     notFound()
//   }
//   const handleDelete = () => {
//     // DeleteUser(user_id_tar)
//     // router.push("/admin"); 

//   };
//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex flex-col gap-6">
//         {/* Header with Actions */}
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-2xl font-bold">{user.user_name}</h1>
//             <div className="flex gap-2 mt-2">
//               <div className="badge badge-secondary">ROLE: {user.user_role}</div>
//               <div className="badge badge-ghost">ID: {user.user_id}</div>
//               <div className="badge badge-outline">EMAIL: {user.user_email}</div>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button className="btn btn-ghost btn-sm" >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//               </svg>
//             </button>
//             <DelUser uid={user_id_tar}/>
//           </div>
//         </div>

//         {/* MT5 Accounts Section */}
//         <div className="card bg-base-100 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title text-lg">MT5 Accounts</h2>
//             <div className="grid gap-4 mt-4">
//               {user.mt5_accounts?.length > 0 ? (
//                 user.mt5_accounts.map((account: MT5Account) => (
//                   <div key={account.acc_id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
//                     <div className="flex flex-col">
//                       <span className="font-medium">{account.acc_name}</span>
//                       <span className="text-sm opacity-70">Account id: {account.acc_id}</span>
//                     </div>
//                     <div className="flex items-center gap-4">
//                       <div className={`badge ${account.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
//                         {account.status}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-base-content/60">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
//                   </svg>
//                   <p>No MT5 accounts found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Billing History Section */}
//         <div className="card bg-base-100 shadow-lg">
//           <div className="card-body">
//             <h2 className="card-title text-lg">Billing History</h2>
//             <div className="grid gap-4 mt-4">
//               {user.bill?.length > 0 ? (
//                 user.bill.map((bill: Bill) => (

//                   <div key={bill.bill_id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
//                     <div className="flex flex-col">
//                       <span className="font-medium">Bill id: {bill.bill_id}</span>
//                       <span className="font-medium">Account ID: {bill.accid}</span>
//                       <span className="text-sm opacity-70">
//                         {new Date(bill.create_date).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })}
//                       </span>
//                     </div>
//                     <div className="badge badge-outline">{bill.bill_status}: ${bill.bill_price}</div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8 text-base-content/60">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
//                   </svg>
//                   <p>No billing history found</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

import { DeleteUser } from '@/app/api/admin/getUser';
import { DelUser } from '@/components/admin/deleteUserButton';
import { notFound, useRouter } from 'next/navigation'

interface User {
  user_id: string;
  user_name: string;
  user_email: string;
  user_role: string;
  mt5_accounts?: MT5Account[];
  bill?: Bill[];
}

interface MT5Account {
  acc_id: string
  acc_name: string
  status: string
  token: string
}

interface Bill {
  bill_id: string;
  create_date: string;
  bill_status: string
  bill_price: string
  mt5_account: MT5Account
  accid: string
}

async function getUserData(user_id: string) {
  try {
    const res = await fetch(`http://localhost:3000/api/users?userId=${user_id}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

export default async function UserDetailPage({ params }: { params: Promise<{ user_id_tar: string }> }) {
  const { user_id_tar } = await params;
  const user = await getUserData(user_id_tar)

  if (!user) {
    notFound()
  }

  // Calculate total bill price
  const totalBillPrice = user.bill?.reduce((total: number, bill: { bill_price: string; }) => {
    return total + parseFloat(bill.bill_price);
  }, 0) || 0;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header with User Information */}
        <div className="card bg-base-100 shadow-xl mb-8 animate-fade-in">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-base-content mb-4">{user.user_name}</h1>
                <div className="flex flex-wrap gap-2">
                  <div className="badge badge-primary badge-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {user.user_role}
                  </div>
                  <div className="badge badge-secondary badge-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {user.user_email}
                  </div>
                  <div className="badge badge-ghost badge-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    {user.user_id}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <DelUser uid={user_id_tar} />
              </div>
            </div>
          </div>
        </div>

        {/* MT5 Accounts Section */}
        <div className="card bg-base-100 shadow-xl mb-8 animate-fade-in">
          <div className="card-body">
            <h2 className="card-title text-xl font-bold mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              MT5 Accounts
            </h2>
            <div className="space-y-4">
              {user.mt5_accounts?.length > 0 ? (
                user.mt5_accounts.map((account: MT5Account) => (
                  <div
                    key={account.acc_id}
                    className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                        {account.acc_name}
                      </span>
                      <span className="text-sm text-base-content/70">
                        Account ID: {account.acc_id}
                      </span>
                    </div>
                    <div className={`badge ${account.status === 'active' ? 'badge-success' : 'badge-warning'} badge-outline`}>
                      {account.status.toUpperCase()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
                  </svg>
                  <p className="text-lg">No MT5 accounts found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing History Section */}
        <div className="card bg-base-100 shadow-xl animate-fade-in">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h2 className="card-title text-xl font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm4 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                </svg>
                Billing History
              </h2>
              <div className="stat bg-base-200 rounded-box p-2">
                <div className="stat-title text-sm">Total Bill Amount</div>
                <div className="stat-value text-primary text-lg">
                  ${totalBillPrice.toFixed(2)}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              {user.bill?.length > 0 ? (
                user.bill.map((bill: Bill) => {
                  // Find the corresponding MT5 account for this bill
                  const matchedAccount = user.mt5_accounts?.find(
                    (account: { acc_id: string; }) => account.acc_id === bill.accid
                  );

                  return (
                    <div
                      key={bill.bill_id}
                      className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-semibold text-base-content group-hover:text-primary transition-colors">
                          Bill ID: {bill.bill_id}
                        </span>
                        <span className="text-sm text-base-content/70">
                          Account: {matchedAccount?.acc_name || bill.accid}
                        </span>
                        <span className="text-xs text-base-content/50">
                          {new Date(bill.create_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <div className={`badge ${bill.bill_status === 'Paid' ? 'badge-success' : 'badge-warning'} badge-outline`}>
                        {bill.bill_status}: ${bill.bill_price}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">No billing history found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}