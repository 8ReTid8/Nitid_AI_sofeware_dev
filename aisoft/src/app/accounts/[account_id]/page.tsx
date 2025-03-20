"use client";
import DelAccount from "@/components/accounts/deleteAccount";
import { EditInformation } from "@/components/accounts/editinformation";
import { useEffect, useState } from "react";

type PPOModel = {
  model_id: string;
  model_name: string;
  model_version: string;
  model_currency: string;
};

type AccountDetails = {
  acc_id: string;
  acc_name: string;
  MT5_id: string
  token: string
  lot_size: string
  status: string;
  balance?: number;
  model?: PPOModel;
};

async function getAccountDetails(account_id: string) {
  const response = await fetch(`http://localhost:3000/api/showaccount/${account_id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch account with ID ${account_id}`);
  }
  return response.json();
}

export default function AccountPage({ params }: { params: Promise<{ account_id: string }> }) {

  const [account, setAccount] = useState<AccountDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const { account_id } = await params;
      setAccountId(account_id);
    };
    fetchParams();
  }, [params]);

  useEffect(() => {
    const fetchAccount = async () => {
      if (!accountId) return;
      try {
        const accountData = await getAccountDetails(accountId);
        setAccount(accountData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch account details.");
      }
    };
    fetchAccount();
  }, [accountId]);

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col gap-4">
          <div className="skeleton h-8 w-64"></div>
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-64 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{account.acc_name}</h1>
          <div className="flex gap-2">
            <EditInformation account={account} />
            <a href="/accounts" className="btn btn-ghost btn-circle">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </a>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content/60 text-sm">Currency</h2>
              <p className="text-2xl font-bold">
                {account.model ? account.model.model_currency : "N/A"}
              </p>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-base-content/60 text-sm">Model</h2>
              <p className="text-2xl font-bold">
                {account.model ? account.model.model_name : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Improved Account Information Card */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-base-content/60 text-sm mb-1">Connection Status</h3>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${account.status === "connect" ? "bg-success" : "bg-error"}`}></span>
                  <p className="font-semibold">{account.status === "connect" ? "Connected" : "Disconnected"}</p>
                </div>
              </div>
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-base-content/60 text-sm mb-1">MT5 ID</h3>
                <p className="font-semibold text-lg">{account.MT5_id}</p>
              </div>
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-base-content/60 text-sm mb-1">Token</h3>
                <div className="flex items-center gap-2">
                  <p className="font-mono bg-base-300 p-1 rounded text-sm overflow-auto max-w-full">
                    {account.token}
                  </p>
                  <button
                    className="btn btn-ghost btn-xs"
                    onClick={() => { navigator.clipboard.writeText(account.token); /* Add toast notification here */ }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="bg-base-200 rounded-lg p-4">
                <h3 className="text-base-content/60 text-sm mb-1">Lot Size</h3>
                <p className="font-semibold text-lg">{account.lot_size}</p>
              </div>

            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {accountId && <DelAccount AccId={accountId} />}
        </div>
      </div>
    </div>
  );
}