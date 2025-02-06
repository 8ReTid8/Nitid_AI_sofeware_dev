"use client";
import { useSession } from "next-auth/react";
import { AddAcc } from "./addAcc";

export default function Accounts() {
    const session = useSession();
    return (
        <div className="min-h-screen bg-gray-100">
            {/* Main Content */}
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">ACCOUNT</h1>
                    {/* <button className="bg-black text-white rounded-full px-4 py-2">add</button> */}
                    <AddAcc />
                </div>

                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
                        <h2 className="text-lg font-semibold text-red-700">Acc_for_EURUSD</h2>
                        <p className="text-gray-700">balance: 1000$</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">view</button>
                    </div>

                    <div className="bg-white shadow rounded-xl p-4 border border-gray-200">
                        <h2 className="text-lg font-semibold text-red-700">JPYUSD_non Acc</h2>
                        <p className="text-gray-700">balance: 125000$</p>
                        <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">view</button>
                    </div>
                </div> */}
            </main>
        </div>
    );
}