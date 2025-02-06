import { authSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ShowUser } from "../../components/admin/showUser";

export default async function Admin() {
    const session = await authSession();
    if (session?.user.role !== "admin") {
        return redirect("/");
    }
    return (
        <div className="pt-20 px-6">
            <ShowUser/>
        </div>
    )
}