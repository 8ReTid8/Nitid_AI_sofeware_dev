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
                      <a href={`/admin/${user.user_id}`}>
                        <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition-all">
                          Edit
                        </button>
                      </a>
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
