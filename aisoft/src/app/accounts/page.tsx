"use client";
import { useSession } from "next-auth/react";
import { AddAcc } from "../../components/accounts/addAcc";
import ShowAccounts from "@/components/accounts/showAcc";
import { redirect } from "next/navigation";

export default function Accounts() {
    const session = useSession();
    console.log(session.data?.user?.role);
    if (session.data?.user?.role === "admin") {
        return redirect("/admin");
    }
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">ACCOUNT</h1>
                    <AddAcc/>
                </div>
                <ShowAccounts/>
            </main>
        </div>
    );
}