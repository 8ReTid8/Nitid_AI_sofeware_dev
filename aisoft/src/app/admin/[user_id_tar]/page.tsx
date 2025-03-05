// import { notFound } from 'next/navigation'

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
//   created_at: string;
//   bill_status: string
// }

// async function getUserData(user_id:string) {
//   try {
//     const res = await fetch(`http://localhost:3000/api/users?userId=${user_id}`, { cache: 'no-store' })
//     if (!res.ok) return null
//     return res.json()
//   } catch (error) {
//     console.error('Error fetching user:', error)
//     return null
//   }
// }

// export default async function UserDetailPage({ params }:{ params: Promise<{ user_id_tar: string }> }) {
//   const { user_id_tar } = await params;
//   const user = await getUserData(user_id_tar)
//   console.log(user)  
//   if (!user) {
//     notFound()
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="card bg-base-100 shadow-xl">
//         {/* Header Section */}
//         <div className="card-body">
//           <div className="flex items-center gap-4">
//             <div className="avatar placeholder">
//               <div className="bg-neutral text-neutral-content rounded-full w-24">
//                 <span className="text-3xl">
//                   {user.user_name?.[0]?.toUpperCase() || '?'}
//                 </span>
//               </div>
//             </div>
//             <div>
//               <h2 className="card-title text-2xl">{user.user_name}</h2>
//               <div className="flex gap-2 mt-1">
//                 <div className="badge badge-secondary">{user.user_role}</div>
//                 <div className="badge badge-ghost">ID: {user.user_id}</div>
//               </div>
//             </div>
//           </div>

//           {/* User Info Section */}
//           <div className="grid gap-4">
//             {user.mt5_accounts?.length > 0 ? (
//                 user.mt5_accounts.map((account: MT5Account) => (
//                     <div key={account.acc_id} className="bg-base-200 p-4 rounded-lg">
//                         <div className="flex justify-between items-center">
//                             <span className="font-medium">Account #{account.acc_id}</span>
//                             <div className="badge">{account.status}</div>
//                         </div>
//                     </div>
//                 ))
//             ) : (
//                 <div className="text-center text-opacity-60">
//                     No MT5 accounts found
//                 </div>
//             )}
//           </div>

//           {/* Billing Section */}
//           <div className="divider">Billing History</div>
//           <div className="grid gap-4">
//             {user.bill?.length > 0 ? (
//               user.bill.map((bill: Bill) => (
//                 <div key={bill.bill_id} className="bg-base-200 p-4 rounded-lg">
//                   <div className="flex justify-between items-center">
//                     <span className="font-medium">Bill #{bill.bill_id}</span>
//                     <span className="text-sm opacity-70">
//                       {new Date(bill.created_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center text-opacity-60">
//                 No billing history found
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="card-actions justify-end mt-6">
//             <button className="btn btn-outline">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
//               </svg>
//               Edit User
//             </button>
//             <button className="btn btn-error">
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               Delete User
//             </button>
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
  // const router = useRouter()
  if (!user) {
    notFound()
  }
  const handleDelete = () => {
    // DeleteUser(user_id_tar)
    // router.push("/admin"); 
    
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-6">
        {/* Header with Actions */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{user.user_name}</h1>
            <div className="flex gap-2 mt-2">
              <div className="badge badge-secondary">ROLE: {user.user_role}</div>
              <div className="badge badge-ghost">ID: {user.user_id}</div>
              <div className="badge badge-outline">EMAIL: {user.user_email}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <DelUser uid={user_id_tar}/>
          </div>
        </div>

        {/* MT5 Accounts Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">MT5 Accounts</h2>
            <div className="grid gap-4 mt-4">
              {user.mt5_accounts?.length > 0 ? (
                user.mt5_accounts.map((account: MT5Account) => (
                  <div key={account.acc_id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium">{account.acc_name}</span>
                      <span className="text-sm opacity-70">Account id: {account.acc_id}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`badge ${account.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                        {account.status}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01" />
                  </svg>
                  <p>No MT5 accounts found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Billing History Section */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-lg">Billing History</h2>
            <div className="grid gap-4 mt-4">
              {user.bill?.length > 0 ? (
                user.bill.map((bill: Bill) => (
                 
                  <div key={bill.bill_id} className="flex items-center justify-between p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-medium">Bill id: {bill.bill_id}</span>
                      <span className="font-medium">Account ID: {bill.accid}</span>
                      <span className="text-sm opacity-70">
                        {new Date(bill.create_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="badge badge-outline">{bill.bill_status}: ${bill.bill_price}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-base-content/60">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <p>No billing history found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}