"use client";
import { authSession } from "@/lib/auth";
import { useState } from "react";
import { useRouter } from 'next/navigation'
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
type PPOModel = {
    model_id: string;
    model_name: string;
    model_version: string;
    model_currency: string;
};


export function EditInformation({ account }: { account: AccountDetails }) {
    const router = useRouter()
    const [showModal, setShowModal] = useState<boolean>(false);
    const availableCurrencies = ["EURUSD", "USDJPY"];
    const [currency, setCurrency] = useState<string>("");
    const [models, setModels] = useState<{ model_id: string, model_name: string }[]>([]);
    const [formData, setFormData] = useState({
        mt5Id: account.MT5_id || "",
        name: account.acc_name || "",
        // currency: account.model?.model_currency || "",
        currency: "",
        model: account.model?.model_name || "",
        volume: account.lot_size || "",
    });

    const handleToggle = () => {
        if (showModal) {
            // setCurrency(account.model?.model_currency || "");
            setCurrency("");
            setModels([]);
            setFormData({
                mt5Id: account.MT5_id || "",
                name: account.acc_name || "",
                currency: account.model?.model_currency || "",
                model: account.model?.model_name || "",
                volume: account.lot_size || "",
            });
        }
        setShowModal((prev) => !prev)
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
        if (!formData.mt5Id || !formData.name || !currency || !formData.model || !formData.volume) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch("/api/updateAccount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, acc_id: account.acc_id }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Edit successfully!");
                handleToggle();
                router.refresh()
            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error edit account:", error);
            alert("Failed to edit account.");
        }
    };

    return (
        <>
            <div>
                <button className="btn btn-ghost btn-circle" onClick={handleToggle}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                    </svg>
                </button>
            </div>
            <Modal open={showModal} onClose={handleToggle}>
                <div className="border-b pb-4 mb-5 flex justify-between items-center">
                    <h3 className="font-bold text-xl">Edit Information</h3>
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
                            Save
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
