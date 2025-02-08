"use client";
import { useSession } from "next-auth/react";
import { AddAcc } from "../../components/accounts/addAcc";
import ShowAccounts from "@/components/accounts/showAcc";

export default function Accounts() {
    const session = useSession();
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">ACCOUNT</h1>
                    {/* <button className="bg-black text-white rounded-full px-4 py-2">add</button> */}
                    <AddAcc/>
                </div>
                <ShowAccounts/>
            </main>
        </div>
    );
}