import Showbill from "@/components/payment/showbill";

export default function Payment() {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">ACCOUNT</h1>
                </div>
                <Showbill />
            </main>
        </div>
    )
}
