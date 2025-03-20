"use client";
import Showbill from "@/components/payment/showbill";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Payment() {
    const session = useSession();
    console.log(session.data?.user?.role);
    if (session.data?.user?.role === "admin") {
        return redirect("/admin");
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">PAYMENT</h1>
                </div>
                <Showbill />
            </main>
        </div>
    )
}
