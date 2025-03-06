// // import { GetUser } from "../../app/api/admin/getUser";

// // export async function ShowUser() {
// //   const users = await GetUser();

// //   return (
// //     <div className="mx-auto w-2/3 bg-gray-100 p-6 rounded-xl shadow-md">
// //       <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
// //         <div className="flex justify-between items-center px-6 py-4 border-b">
// //           <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
// //         </div>

// //         <div className="p-5">
// //           <div className="overflow-x-auto">
// //             <table className="w-full border-collapse">
// //               {/* Table Head */}
// //               <thead className="bg-gray-200">
// //                 <tr className="text-left">
// //                   <th className="py-3 px-4 text-gray-600">#</th>
// //                   <th className="py-3 px-4 text-gray-600">Name</th>
// //                   <th className="py-3 px-4 text-gray-600">Email</th>
// //                   <th className="py-3 px-4 text-gray-600">User ID</th>
// //                   <th className="py-3 px-4 text-gray-600">Role</th>
// //                   <th className="py-3 px-4 text-gray-600"></th>
// //                 </tr>
// //               </thead>

// //               {/* Table Body */}
// //               <tbody>
// //                 {users?.map((user, index) => (
// //                   <tr
// //                     key={index}
// //                     className="border-b hover:bg-gray-100 transition-all"
// //                   >
// //                     <td className="py-3 px-4 font-semibold text-gray-700">{index + 1}</td>
// //                     <td className="py-3 px-4 font-medium text-gray-800">{user.user_name}</td>
// //                     <td className="py-3 px-4 text-gray-700">{user.user_email}</td>
// //                     <td className="py-3 px-4 text-gray-700">{user.user_id}</td>
// //                     <td className="py-3 px-4 text-gray-700">{user.user_role}</td>
// //                     <td className="py-3 px-4">
// //                       <a href={`/admin/${user.user_id}`}>
// //                         <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all">
// //                           Edit
// //                         </button>
// //                       </a>
// //                     </td>
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

import { GetUser } from "../../app/api/admin/getUser";
export async function ShowUser() {
  const users = await GetUser();

  // Calculate total bill payment for all users
  const totalBillPayment = users?.reduce((total, user) =>
    total + user.bill.reduce((billTotal, bill) => billTotal + Number(bill.bill_price || 0), 0),
    0) || 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        {/* Header with Title and Total Bill Information */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <div className="text-lg font-semibold text-green-600">
            Total Bill Payment: ${totalBillPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr className="text-left text-gray-600">
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Total Bill</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users && users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.user_id}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 text-gray-700">{index + 1}</td>
                    <td className="px-4 py-3 font-medium text-gray-800">{user.user_name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.user_email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.user_id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        user.user_role === 'admin' ? 'bg-blue-100 text-blue-800' :
                          user.user_role === 'user' ? 'bg-green-100 text-green-800' :
                            user.user_role === "ban" ? "bg-red-100 text-red-800" :
                              'bg-gray-100 text-gray-800'
                        }`}>
                        {user.user_role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">
                      ${user.bill.reduce((sum, bill) => sum + Number(bill.bill_price || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <a href={`/admin/${user.user_id}`} className="inline-block">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded-md 
                          hover:bg-blue-600 transition-colors text-sm">
                          Manage
                        </button>
                      </a>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="bg-gray-50 px-6 py-4 text-right">
          <div className="text-sm text-gray-600">
            Total Users: {users?.length || 0}
          </div>
        </div>
      </div>
    </div >
  );
}

export default ShowUser;
