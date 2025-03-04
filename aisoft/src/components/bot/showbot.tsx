'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function Showbot() {
    const [models, setModels] = useState<any[]>([]);
    const [selectedModel, setSelectedModel] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const response = await fetch('/api/getbot');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }
                const data = await response.json();
                setModels(data);
            } catch (err: any) {
                setError(err.message || "Failed to fetch model data.");
            } finally {
                setLoading(false);
            }
        };
        fetchModels();
    }, []);

    const handleViewDetailClick = (model: any) => {
        setSelectedModel(model);
        const modelDetailElement = document.getElementById("modelDetail");
        if (modelDetailElement) {
            window.scrollTo({ top: modelDetailElement.offsetTop - 80, behavior: "smooth" });
        }
    };

    // Sample performance data (would come from your API)
    // const getPerformanceData = (modelCurrency: string) => {
    //     const performanceMap: any = {
    //         "EURUSD": { winRate: "72%", profitFactor: "1.95", drawdown: "9.3%" },
    //         "GBPUSD": { winRate: "68%", profitFactor: "1.75", drawdown: "12.3%" },
    //         "USDJPY": { winRate: "65%", profitFactor: "1.62", drawdown: "10.8%" },
    //     };
    //     return performanceMap[modelCurrency] || { winRate: "67%", profitFactor: "1.70", drawdown: "11.5%" };
    // };


    return (
        <div className="min-h-screen bg-base-200 p-4 md:p-8">
            {loading ? (
                <div className="flex justify-center items-center p-16">
                    <span className="loading loading-spinner loading-lg text-primary"></span>
                </div>
            ) : error ? (
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span>{error}</span>
                </div>
            ) : models.length === 0 ? (
                <div className="text-center p-8">
                    <p className="text-gray-500">No models found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {models.map((model, index) => {
                        // const perfData = getPerformanceData(model.model_currency);
                        return (
                            <div key={index} className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow">
                                <div className="card-body">
                                    <div className="flex justify-between items-start">
                                        <h3 className="card-title">{model.model_name}</h3>
                                        <div className="badge badge-primary">{model.model_currency}</div>
                                    </div>

                                    <p className="text-sm opacity-75 mt-1">Version: {model.model_version}</p>

                                    <div className="divider my-2"></div>

                                    <div className="grid grid-cols-3 gap-2 text-center my-2">
                                        <div className="bg-base-200 rounded-lg p-2">
                                            <div className="text-xs opacity-75">Win Rate</div>
                                            <div className="text-success font-bold">{Number(model.model_winrate).toFixed(2)}</div>
                                        </div>
                                        <div className="bg-base-200 rounded-lg p-2">
                                            <div className="text-xs opacity-75">Profit</div>
                                            <div className="text-primary font-bold">{Number(model.model_profit_factor).toFixed(2)}</div>
                                        </div>
                                        <div className="bg-base-200 rounded-lg p-2">
                                            <div className="text-xs opacity-75">Drawdown</div>
                                            <div className="text-warning font-bold">{Number(model.model_drawdown).toFixed(2)}</div>
                                        </div>
                                    </div>

                                    <div className="card-actions justify-end mt-4">
                                        <button
                                            className="btn btn-primary btn-block"
                                            onClick={() => handleViewDetailClick(model)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Model Details Card (shown when a model is selected) */}
            {selectedModel && (
                <div id="modelDetail" className="card bg-base-100 shadow-xl mt-12">
                    <div className="card-body">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{selectedModel.model_name}</h2>
                                <p className="text-base-content/70">Detailed model information</p>
                            </div>
                            <div className="badge badge-lg badge-primary">{selectedModel.model_currency}</div>
                        </div>

                        <div className="divider"></div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="stat bg-base-200 rounded-box">
                                <div className="stat-title">Model Version</div>
                                <div className="stat-value text-lg">{selectedModel.model_version}</div>
                                <div className="stat-desc">Latest update</div>
                            </div>

                            <div className="stat bg-base-200 rounded-box">
                                <div className="stat-title">Primary Algorithm</div>
                                <div className="stat-value text-lg">PPO</div>
                                <div className="stat-desc">Proximal Policy Optimization</div>
                            </div>

                            <div className="stat bg-base-200 rounded-box">
                                <div className="stat-title">Timeframe</div>
                                <div className="stat-value text-lg">H1</div>
                                <div className="stat-desc">Hourly trading</div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
                            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                                <div className="stat">
                                    <div className="stat-figure text-success">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    </div>
                                    <div className="stat-title">Win Rate</div>
                                    <div className="stat-value text-success">
                                        {Number(selectedModel.model_winrate).toFixed(2)}                                    
                                    </div>
                                    <div className="stat-desc">Last 30 days</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                    </div>
                                    <div className="stat-title">Profit Factor</div>
                                    <div className="stat-value text-primary">
                                        {Number(selectedModel.model_profit_factor).toFixed(2)}                                    
                                    </div>
                                    <div className="stat-desc">Ratio of wins to losses</div>
                                </div>

                                <div className="stat">
                                    <div className="stat-figure text-warning">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    </div>
                                    <div className="stat-title">Drawdown</div>
                                    <div className="stat-value text-warning">
                                        {Number(selectedModel.model_drawdown).toFixed(2)}                                    
                                    </div>
                                    <div className="stat-desc">Maximum</div>
                                </div>
                            </div>
                        </div>

                        {/* <div className="mt-6">
                            <h3 className="text-lg font-semibold mb-2">Monthly Performance</h3>
                            <div className="overflow-x-auto">
                                <table className="table table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Month</th>
                                            <th>Return</th>
                                            <th>Trades</th>
                                            <th>Win %</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>January</td>
                                            <td className="text-success">+4.2%</td>
                                            <td>32</td>
                                            <td>68.7%</td>
                                        </tr>
                                        <tr>
                                            <td>February</td>
                                            <td className="text-success">+3.8%</td>
                                            <td>28</td>
                                            <td>71.4%</td>
                                        </tr>
                                        <tr>
                                            <td>March</td>
                                            <td className="text-error">-1.5%</td>
                                            <td>35</td>
                                            <td>57.1%</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div> */}

                        <div className="card-actions justify-end mt-6">
                            <div className="flex flex-col md:flex-row w-full md:w-auto gap-2">
                                <button className="btn btn-outline">View Backtest</button>
                                <button className="btn btn-primary">Use This Model</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}