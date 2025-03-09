import { authSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await authSession();
  console.log(session?.user.role);
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
              <h1 className="text-5xl font-bold text-error">Manage Your Finances with Precision</h1>
              <p className="py-6 text-lg">DOLLARS helps you track, manage and optimize your financial accounts with unmatched accuracy.</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-error">Get Started</button>
                <button className="btn btn-outline btn-error">Learn More</button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4 bg-error/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-error">Ready to Take Control of Your Finances?</h2>
            <p className="mb-8 text-lg">Join thousands of users who trust DOLLARS for their financial management needs.</p>
            <a href="/accounts" className="link link-error">
              <button className="btn btn-error btn-lg">Create Free Account</button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}