'use client';
import { useState, useEffect } from "react";

export default function Showbot() {
    const [models, setModels] = useState<Record<string, any[]>>({});
    const [selectedCurrency, setSelectedCurrency] = useState<string | null>(null);
    const [selectedVersion, setSelectedVersion] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/getbot');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();

                // Group models by currency
                const groupedModels = data.reduce((acc: Record<string, any[]>, model: any) => {
                    if (!acc[model.model_currency]) {
                        acc[model.model_currency] = [];
                    }
                    acc[model.model_currency].push(model);
                    return acc;
                }, {});

                setModels(groupedModels);
            } catch (err: any) {
                setError(err.message || "Failed to fetch model data.");
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    const handleViewDetailClick = (currency: string) => {
        setSelectedCurrency(currency);
        setSelectedVersion(null); // Reset version selection
        const modelDetailElement = document.getElementById("modelDetail");
        if (modelDetailElement) {
            window.scrollTo({ top: modelDetailElement.offsetTop - 80, behavior: "smooth" });
        }
    };

    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8 font-sans">
            {loading ? (
                <div className="flex justify-center items-center h-screen">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : error ? (
                <div role="alert" className="alert alert-error shadow-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            ) : Object.keys(models).length === 0 ? (
                <div className="hero min-h-screen bg-base-200">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <p className="text-2xl text-gray-500">No models found</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto">
                    {/* Currency Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(models).map(([currency]) => (
                            <div key={currency} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all group">
                                <div className="card-body">
                                    <div className="flex justify-between items-center">
                                        <h3 className="card-title text-xl font-bold text-base-content group-hover:text-primary transition-colors">
                                            {currency} Models
                                        </h3>
                                        <div className="badge badge-primary badge-outline">{currency}</div>
                                    </div>

                                    <div className="divider my-2"></div>

                                    <div className="card-actions justify-end mt-4">
                                        <button 
                                            className="btn btn-primary btn-block transition-all hover:scale-105 active:scale-95"
                                            onClick={() => handleViewDetailClick(currency)}
                                        >
                                            View Details
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Model Selection */}
                    {selectedCurrency && (
                        <div id="modelDetail" className="card bg-base-100 shadow-xl mt-12 animate-fade-in">
                            <div className="card-body">
                                <h2 className="text-3xl font-extrabold text-base-content">{selectedCurrency} Models</h2>
                                <p className="text-base-content/70 text-sm">Select a model version to view details</p>

                                <div className="divider"></div>

                                {/* Model Version Selection */}
                                <div className="form-control w-full">
                                    <select
                                        className="select select-primary select-bordered w-full"
                                        value={selectedVersion?.model_version || ''}
                                        onChange={(e) => {
                                            const version = models[selectedCurrency].find(m => m.model_version === e.target.value);
                                            setSelectedVersion(version || null);
                                        }}
                                    >
                                        <option disabled value="">Select Model Version</option>
                                        {models[selectedCurrency].map((model, index) => (
                                            <option key={index} value={model.model_version}>
                                                {model.model_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Detailed Model Information */}
                                {selectedVersion && (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                            {[
                                                { title: "Model Version", value: selectedVersion.model_version, desc: "Latest update" },
                                                { title: "Primary Algorithm", value: "PPO", desc: "Proximal Policy Optimization" },
                                                { title: "Timeframe", value: "H1", desc: "Hourly trading" }
                                            ].map((stat, index) => (
                                                <div key={index} className="stat bg-base-200 rounded-box hover:bg-base-300 transition-colors">
                                                    <div className="stat-title text-base-content/70">{stat.title}</div>
                                                    <div className="stat-value text-lg text-base-content">{stat.value}</div>
                                                    <div className="stat-desc text-base-content/50">{stat.desc}</div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-6">
                                            <h3 className="text-xl font-semibold mb-4 text-base-content">Performance Metrics</h3>
                                            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                                                {[
                                                    { 
                                                        title: "Win Rate", 
                                                        value: Number(selectedVersion.model_winrate).toFixed(2), 
                                                        desc: "Last 30 days",
                                                        color: "text-success"
                                                    },
                                                    { 
                                                        title: "Profit Factor", 
                                                        value: Number(selectedVersion.model_profit_factor).toFixed(2), 
                                                        desc: "Ratio of wins to losses",
                                                        color: "text-primary"
                                                    },
                                                    { 
                                                        title: "Drawdown", 
                                                        value: Number(selectedVersion.model_drawdown).toFixed(2), 
                                                        desc: "Maximum",
                                                        color: "text-warning"
                                                    }
                                                ].map((stat, index) => (
                                                    <div key={index} className="stat hover:bg-base-200 transition-colors">
                                                        <div className="stat-title">{stat.title}</div>
                                                        <div className={`stat-value ${stat.color}`}>{stat.value}</div>
                                                        <div className="stat-desc">{stat.desc}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}