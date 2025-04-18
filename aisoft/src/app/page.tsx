import ForexCharts from "@/components/graphForex/ForexGraph";
import { authSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await authSession();
  console.log(session?.user.role);
  console.log(new Date(new Date().getTime() + 7 * 60 * 60 * 1000))
  if (session?.user.role === "admin") {
    return redirect("/admin");
  }

  return (
    <div>
      <div className="min-h-screen bg-base-100">
        {/* Hero Section */}
        <div className="hero bg-error/10 py-16">
          <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl">
            <div className="lg:pr-8">
              <h1 className="text-5xl font-bold text-error">Dollars AI: Smart Trading Bot</h1>
              <p className="py-6 text-lg">DOLLARS is an AI-powered platform designed to help you trade currencies more efficiently and maximize your profits.</p>
            </div>
          </div>
        </div>
        <ForexCharts />
        {/* CTA Section */}
        <div className="py-16 px-4 bg-error/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-error">Take Charge of Your Financial Future</h2>
            <p className="mb-8 text-lg">Join thousands of traders leveraging DOLLARS AI to optimize their investments and grow their wealth.</p>
            <a href="/accounts" className="link link-error">
              <button className="btn btn-error btn-lg">Create Free Account</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
