// import { GetUser } from "../api/admin/getUser"

// export async function ShowUser() {
//   const users = await GetUser();
//   return (
//     <div className="mx-auto w-2/3 bg-base-300">
//       <div className="mx-auto w-full bg-base-100 shadow-lg mt-3">
//         <div className="flex justify-between font-semibold p-5 border-b-2">
//           <span>User Manage</span>
//         </div>
//         <div className="p-5">
//           <div className="overflow-x-auto ">
//             <table className="table">
//               {/* head */}
//               <thead>
//                 <tr>
//                   <th></th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>UserID</th>
//                   <th>Report</th>
//                   <th></th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {users?.map((user, index) => (
//                   <tr key={index}>
//                     <th>
//                       <label>

//                       </label>
//                     </th>
//                     <td>
//                       <div className="flex items-center gap-3">
//                         <div>
//                           <div className="font-bold">{user.user_name}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td>{user.user_email}</td>
//                     <td>{user.user_id}</td>
//                     <th>

//                     </th>
//                   </tr>
//                 ))}
//               </tbody>
//               {/* foot */}
//               <tfoot>
//                 <tr>
//                   <th></th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>UserID</th>
//                   <th>Report</th>
//                   <th></th>
//                 </tr>
//               </tfoot>

//             </table>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
import { GetUser } from "../../app/api/admin/getUser";

export async function ShowUser() {
  const users = await GetUser();

  return (
    <div className="mx-auto w-2/3 bg-gray-100 p-6 rounded-xl shadow-md">
      <div className="w-full bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </div>

        <div className="p-5">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              {/* Table Head */}
              <thead className="bg-gray-200">
                <tr className="text-left">
                  <th className="py-3 px-4 text-gray-600">#</th>
                  <th className="py-3 px-4 text-gray-600">Name</th>
                  <th className="py-3 px-4 text-gray-600">Email</th>
                  <th className="py-3 px-4 text-gray-600">User ID</th>
                  <th className="py-3 px-4 text-gray-600">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {users?.map((user, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition-all"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-700">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">{user.user_name}</td>
                    <td className="py-3 px-4 text-gray-700">{user.user_email}</td>
                    <td className="py-3 px-4 text-gray-700">{user.user_id}</td>
                    <td className="py-3 px-4">
                      {/* <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all">
                        Report
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
