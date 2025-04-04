"use client";
import { authSession } from "@/lib/auth";
import { randomBytes } from "crypto";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'

export function AddAcc() {
    const router = useRouter()
    const [showModal, setShowModal] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const availableCurrencies = ["EURUSD", "USDJPY", "GBPUSD"];
    const [currency, setCurrency] = useState<string>("");
    const [models, setModels] = useState<{ model_id: string, model_name: string }[]>([]);
    const [formData, setFormData] = useState({
        mt5Id: "",
        name: "",
        currency: "",
        model: "",
        volume: "0.01",
    });
    
    const forcePageRefresh = () => {
        // Save a flag in sessionStorage
        sessionStorage.setItem('shouldRefresh', 'true');
        // Hard refresh the page
        window.location.reload();
    };


    const handleToggle = () => {
        if (showModal) {
            setToken("");
            setCurrency("");
            setModels([]);
            setFormData({
                mt5Id: "",
                name: "",
                currency: "",
                model: "",
                volume: "0.01",
            });
        }
        setShowModal((prev) => !prev)
    };

    const handleGenerateToken = () => {
        try {
            const newToken = randomBytes(16).toString('hex');
            setToken(newToken);
            console.log(newToken)
        } catch (error) {
            console.log(error)
        }
    };

    const handleCurrencyChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCurrency = e.target.value;
        setCurrency(selectedCurrency);
        setFormData({ ...formData, currency: selectedCurrency, model: "" });

        if (!selectedCurrency) {
            setModels([]);
            return;
        }

        try {
            const response = await fetch(`/api/getmodel?currency=${selectedCurrency}`);
            const data = await response.json();
            setModels(data); // Expecting an array of { model_id, model_name }
            console.log(data)
        } catch (error) {
            console.error("Error fetching models:", error);
            setModels([]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        if (id === "volume") {
            // Convert the input value to a number
            const numValue = parseFloat(value);

            // Check if the value is a number and within the specified range
            if (numValue >= 0.01 && numValue <= 1) {
                setFormData({ ...formData, [id]: value });
            } else {
                // Optionally, you can alert or show a message to the user
                alert("Please enter a volume between 0.01 and 1.");
            }
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.mt5Id || !formData.name || !currency || !formData.model || !formData.volume || !token) {
            alert("Please fill all fields and generate a token.");
            return;
        }

        try {
            const checkResponse = await fetch(`/api/check-mt5?mt5Id=${formData.mt5Id}`);
            const checkData = await checkResponse.json();
            if (checkData.exists) {
                alert("This MT5 ID already exists!");
                return;
            }

            const response = await fetch("/api/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, token }),
            });

            const data = await response.json();
            if (response.status === 201) {
                alert("Account created successfully!");
                handleToggle();   
                forcePageRefresh();            
            } else if (response.status === 409) {
                // alert("This MT5 ID already exists!");
                alert(data.message);
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Failed to create account.");
        }
    };
    const handleDownload = () => {
        window.location.href = "/DollarsAPI&BOT.zip"; // Calls the API
    };
    return (
        <>
            <div>
                <button onClick={handleToggle} className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 font-medium flex items-center gap-2 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    Add Account
                </button>
            </div>
            <Modal open={showModal} onClose={handleToggle}>
                <div className="border-b pb-4 mb-5 flex justify-between items-center">
                    <h3 className="font-bold text-xl">New Trading Account</h3>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={handleToggle}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="mt5Id">
                                MT5 ID
                            </label>
                            <input
                                id="mt5Id"
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter MT5 ID"
                                value={formData.mt5Id}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="name">
                                Account Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                placeholder="Enter account name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="tokenId">
                            Token ID
                        </label>
                        <div className="flex gap-2">
                            <input
                                id="tokenId"
                                type="text"
                                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 transition-all"
                                placeholder="Generate token ID"
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                readOnly
                            />
                            <button
                                type="button"
                                className="bg-blue-500 text-white p-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
                                onClick={handleGenerateToken}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path>
                                    <line x1="16" y1="8" x2="2" y2="22"></line>
                                    <line x1="17.5" y1="15" x2="9" y2="15"></line>
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">This token is required for API authentication.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="currency">
                                Currency Pair
                            </label>
                            <select
                                id="currency"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                                value={currency}
                                onChange={handleCurrencyChange}
                            >
                                <option value="">Select Currency Pair</option>
                                {availableCurrencies.map((cur) => (
                                    <option key={cur} value={cur}>{cur}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="model">
                                Trading Model
                            </label>
                            <select
                                id="model"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white transition-all"
                                value={formData.model}
                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                disabled={!currency || models.length === 0}
                            >
                                <option value="">Select Model</option>
                                {models.map((model) => (
                                    <option key={model.model_id} value={model.model_id}>{model.model_name}</option>
                                ))}
                            </select>
                            {(!currency || models.length === 0) &&
                                <p className="text-xs text-gray-500 mt-1">Please select a currency pair first</p>
                            }
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="volume">
                            Trading Volume
                        </label>
                        <input
                            id="volume"
                            type="number"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            placeholder="Enter volume (0.01-1.00)"
                            value={formData.volume}
                            onChange={handleChange}
                            min="0.01"
                            max="1"
                            step="0.01"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter a value between 0.01 and 1.00</p>
                    </div>

                    <div className="pt-2">
                        <button
                            type="button"
                            className="w-full bg-gray-100 text-gray-800 font-medium p-3 rounded-lg hover:bg-gray-200 border border-gray-300 transition-all flex items-center justify-center gap-2"
                            onClick={handleDownload}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Download API
                        </button>
                        <p className="mt-2 text-sm text-blue-600 cursor-pointer hover:underline"
                            onClick={() => window.location.href = "/install-bot"}>
                            How to Set Up
                        </p>
                    </div>

                    <div className="pt-4 flex justify-end gap-3 border-t">
                        <button
                            type="button"
                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-all"
                            onClick={handleToggle}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-black text-white px-5 py-2 rounded-lg hover:bg-gray-800 transition-all font-medium"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export function Modal({ children, open, onClose }: { children: React.ReactNode, open: boolean, onClose?: () => void }) {
    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${open ? "opacity-100 visible" : "opacity-0 invisible"} transition-all duration-300`}>
            <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
            <div className={`bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10 p-6 ${open ? "scale-100" : "scale-95"} transition-all duration-300`}>
                {children}
            </div>
        </div>
    );
}