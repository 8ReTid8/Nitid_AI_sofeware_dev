import SignInForm from "@/components/form/signinform";
import { authSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SignIn() {
    const session = await authSession();

    if (session?.user) {
        if (session?.user.role === "admin") {
            return redirect("/admin");
        }
        else {
            return redirect("/");
        }
    }
    return (
        <div>
            <SignInForm />
        </div>
    )
}