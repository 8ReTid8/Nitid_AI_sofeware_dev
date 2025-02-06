import { useState } from "react";

export function AddAcc() {
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleToggle = () => {
        setShowModal((prev) => !prev)
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
                <form>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="mt5Id">
                            MT5 ID
                        </label>
                        <input
                            id="mt5Id"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="MT5 ID"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="name2">
                            Name
                        </label>
                        <input
                            id="name2"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Name"
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
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="button"
                            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                        >
                            Generate
                        </button>
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="currency">
                            Currency
                        </label>
                        <input
                            id="currency"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Currency"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="model">
                            Model
                        </label>
                        <input
                            id="model"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Model"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm mb-1" htmlFor="volume">
                            Volume
                        </label>
                        <input
                            id="volume"
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Volume"
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
