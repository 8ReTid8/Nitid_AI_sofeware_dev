import { authSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Admin() {
    const session = await authSession();
    if (session?.user.role !== "admin") {
        return redirect("/");
    }
    return (
        <div>
            <h1>Admin Page</h1>
        </div>
    )
}