import Showbot from "@/components/bot/showbot";

export default function Bot() {
    return (
        <div className="min-h-screen bg-gray-100">
            <main className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-5xl font-bold ">BOT</h1>
                </div>
                <Showbot/>
            </main>
        </div>
    )
}