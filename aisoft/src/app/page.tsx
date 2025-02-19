import { authSession } from "@/lib/auth";

import { redirect } from "next/navigation";

// export default function Home() {
//   return (
//     <div>
//       <Chart symbol="EURUSD" timeframe="D1" numBars={50} />
//     </div>
//   );
// }

export default async function Home() {
  const session = await authSession();
  if (session?.user.role === "admin") {
    return redirect("/admin");
  }
  console.log(session);
  return (
    <div>
      {/* <Chart symbol="EURUSD" timeframe="D1" numBars={50} /> */}
    </div>
  );
}