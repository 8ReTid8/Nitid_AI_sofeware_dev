import { authSession } from "@/lib/auth";

import { redirect } from "next/navigation";

// export default function Home() {
//   return (
//     <div>
//       <Chart symbol="EURUSD" timeframe="D1" numBars={50} />
//     </div>
//   );
// }

export default async function Home() {
  const session = await authSession();
  if (session?.user.role === "admin") {
    return redirect("/admin");
  }
  console.log(session);
  return (
    <div>
      {/* <Chart symbol="EURUSD" timeframe="D1" numBars={50} /> */}
      <div className="min-h-screen bg-base-100">
        {/* Header already exists in your app */}

        {/* Hero Section */}
        <div className="hero bg-base-200 py-16">
          <div className="hero-content flex-col lg:flex-row-reverse max-w-6xl">
            <img
              src="/api/placeholder/600/400"
              alt="Financial management illustration"
              className="max-w-sm rounded-lg shadow-2xl"
            />
            <div className="lg:pr-8">
              <h1 className="text-5xl font-bold text-primary">Manage Your Finances with Ease</h1>
              <p className="py-6 text-lg">DOLLARS helps you track, manage and optimize your financial accounts in one place. Get started today and take control of your finances.</p>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-primary">Get Started</button>
                <button className="btn btn-outline">Learn More</button>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need</h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="card-title text-xl">Multiple Accounts</h3>
                  <p>Connect and manage all your financial accounts in one secure dashboard.</p>
                  <div className="mt-4">
                    <a href="/accounts" className="link link-primary">View Accounts →</a>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <h3 className="card-title text-xl">Fast Payments</h3>
                  <p>Send and receive payments quickly and securely across your accounts.</p>
                  <div className="mt-4">
                    <a href="/payment" className="link link-primary">Make Payment →</a>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="card-body items-center text-center">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="card-title text-xl">AI Assistant</h3>
                  <p>Get personalized financial advice and support from our intelligent bot.</p>
                  <div className="mt-4">
                    <a href="/bot" className="link link-primary">Chat with Bot →</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-base-200 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose DOLLARS</h2>

            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div className="stat-title">Active Users</div>
                <div className="stat-value text-primary">100K+</div>
                <div className="stat-desc">21% more than last year</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                  </svg>
                </div>
                <div className="stat-title">Processed</div>
                <div className="stat-value text-primary">$1.2B</div>
                <div className="stat-desc">In transactions</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="stat-title">Security</div>
                <div className="stat-value text-primary">99.9%</div>
                <div className="stat-desc">Secure transactions</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Control of Your Finances?</h2>
            <p className="mb-8 text-lg">Join thousands of users who trust DOLLARS for their financial management needs.</p>
            <button className="btn btn-primary btn-lg">Create Free Account</button>
          </div>
        </div>

      </div>
    </div>
  );
}