"use client";
import { authSession } from "@/lib/auth";
import { randomBytes } from "crypto";
import { useState } from "react";
import { useRouter } from 'next/navigation'

export function AddAcc() {
    const router = useRouter()
    const [showModal, setShowModal] = useState<boolean>(false);
    const [token, setToken] = useState<string>("");
    const availableCurrencies = ["EURUSD", "USDJPY"];
    const [currency, setCurrency] = useState<string>("");
    const [models, setModels] = useState<{ model_id: string, model_name: string }[]>([]);
    const [formData, setFormData] = useState({
        mt5Id: "",
        name: "",
        currency: "",
        model: "",
        volume: "",
    });

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
                volume: "",
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
        // setFormData({ ...formData, [e.target.id]: e.target.value });
        // console.log(formData)
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
            const response = await fetch("/api/accounts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, token }),
            });

            const data = await response.json();
            if (response.ok) {
                alert("Account created successfully!");
                handleToggle();
                router.refresh()

            } else {
                alert("Error: " + data.error);
            }
        } catch (error) {
            console.error("Error creating account:", error);
            alert("Failed to create account.");
        }

    };

    return (
        <>
            <div>
                <button onClick={handleToggle} className="bg-black text-white rounded-full px-4 py-2">add</button>
            </div>
            <Modal open={showModal}>
                <div className="modal-top mb-5">
                    <h3 className="font-bold text-lg">New Account</h3>
                    <button className="absolute top-2 right-5 text-gray-500 text-[25px]" onClick={handleToggle}>x</button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="mt5Id">
                            MT5 ID
                        </label>
                        <input
                            id="mt5Id"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MT5 ID"
                            value={formData.mt5Id}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="name">
                            Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="tokenId">
                            Token ID
                        </label>
                        <input
                            id="tokenId"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Token ID"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                            onClick={handleGenerateToken}
                        >
                            Generate
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="currency">Currency</label>
                        <select
                            id="currency"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={currency}
                            onChange={handleCurrencyChange}
                        >
                            <option value="">Select Currency</option>
                            {availableCurrencies.map((cur) => (
                                <option key={cur} value={cur}>{cur}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="model">
                            Model
                        </label>

                        <select
                            id="model"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.model}
                            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                            disabled={!currency || models.length === 0}
                        >
                            <option value="">Select Model</option>
                            {models.map((model) => (
                                <option key={model.model_id} value={model.model_id}>{model.model_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="volume">
                            Volume
                        </label>
                        <input
                            id="volume"
                            type="number"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Volume"
                            value={formData.volume}
                            onChange={handleChange}
                            min="0.01"      // Minimum value
                            max="1"         // Maximum value
                            step="0.01"
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Download API
                        </button>
                    </div>
                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800"
                        // onChange={handleChange}
                        >
                            Create
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    )
}

export function Modal({ children, open }: { children: React.ReactNode, open: boolean }) {
    return (
        <div className={`modal modal-bottom sm:modal-middle ${open && "modal-open"}`}>
            <div className="modal-box">{children}</div>
        </div>
    );
}
