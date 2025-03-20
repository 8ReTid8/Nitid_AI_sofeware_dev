"use client";
import Showbot from "@/components/bot/showbot";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Bot() {
    const session = useSession();
    console.log(session.data?.user?.role);
    if (session.data?.user?.role === "admin") {
        return redirect("/admin");
    }
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">BOT</h1>
                </div>
                <Showbot />
            </main>
        </div>
    )
}