export function ShowUser() {
    return (
        <div className="mx-auto w-full bg-base-100 shadow-lg mt-3">
        <div className="flex justify-between font-semibold p-5 border-b-2">
          <span>Report Manage</span>
        </div>
        <div className="p-5">
          <div className="overflow-x-auto ">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>UserID</th>
                  <th>Score</th>
                  <th>Report</th>
                  <th></th>
                </tr>
              </thead>
              {/* <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <th>
                      <label>
                        <DeleteButton userid={user.id} username={user.name} props={user.report} product={user.product}></DeleteButton>
                      </label>
                    </th>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12">
                            <img src={user.picture} alt="Avatar Tailwind CSS Component" />
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.id}</td>
                    <td>{user.score}</td>
                    <th>
                      <DeatailReport data={user.report}></DeatailReport>
                    </th>
                  </tr>
                ))}
              </tbody> */}
              {/* foot */}
              <tfoot>
                <tr>
                  <th></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>UserID</th>
                  <th>Score</th>
                  <th>Report</th>
                  <th></th>
                </tr>
              </tfoot>

            </table>
          </div>
        </div>
      </div>
    )
}