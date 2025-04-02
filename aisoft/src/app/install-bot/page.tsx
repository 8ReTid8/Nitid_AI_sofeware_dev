// pages/index.js or app/page.js (depending on your Next.js version)
"use client";
import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

export default function InstallationTutorial() {
    return (
        <div className="min-h-screen bg-base-200">
            <div className="container mx-auto px-4 py-8">
                {/* Installation Steps */}
                <h2 className="text-3xl font-bold text-center mb-8">Installation Steps</h2>
                <div className="space-y-12">
                    {/* Step 1 */}
                    <div className="step-item flex">
                        <div className="mr-6">
                            <div className="avatar placeholder">
                                <div className="bg-red-500 text-white rounded-full w-12">
                                    <span>1</span>
                                </div>
                            </div>
                            <div className="step-line h-full border-l-2 border-red-500 ml-6 mt-2"></div>
                        </div>
                        <div className="card bg-base-100 shadow-xl flex-1">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Download the installer</h3>
                                <p>
                                    When you download the folder, you'll find two subfolders inside:
                                </p>
                                <p>
                                    API Folder – This contains the bot files used for predicting Forex currency movements.
                                </p>
                                <p>
                                    Library Folder – This includes the necessary tools for installing dependencies to connect server.
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step1.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        // className="rounded-lg w-full max-w-md shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                <p>
                                    API :
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step1_1.png"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                <p>
                                    libaries :
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step1_2.png"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                {/* <div className="mt-4">
                                    <button className="btn btn-primary">Download SuperApp v3.2.1</button>
                                </div>
                                <div className="alert alert-info mt-4 ">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    <span>Always verify the file hash after downloading for security.</span>
                                </div> */}

                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="step-item flex">
                        <div className="mr-6">
                            <div className="avatar placeholder">
                                <div className="bg-red-500 text-white rounded-full w-12">
                                    <span>2</span>
                                </div>
                            </div>
                            <div className="step-line h-full border-l-2 border-red-500 ml-6 mt-2"></div>
                        </div>
                        <div className="card bg-base-100 shadow-xl flex-1">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Launch MetaTrader5</h3>
                                <p>
                                    Open MetaTrader5.
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step2.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"

                                    />
                                </div>

                                <p>
                                    Open the file, then click "Open Data Folder."
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step2_2.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                {/* <div className="mockup-code mt-4">
                                    <pre><code>SuperApp_v3.2.1_setup.exe</code></pre>
                                </div> */}

                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="step-item flex">
                        <div className="mr-6">
                            <div className="avatar placeholder">
                                <div className="bg-red-500 text-white rounded-full w-12">
                                    <span>3</span>
                                </div>
                            </div>
                            <div className="step-line h-full border-l-2 border-red-500 ml-6 mt-2"></div>
                        </div>
                        <div className="card bg-base-100 shadow-xl flex-1">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Access the MQL5 Folder</h3>
                                <p>After opening the Data Folder, navigate to and click on the "MQL5" folder.</p>

                                <div className="my-4">
                                    <img
                                        src="/step3.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                <p>The MQL5 folder will open, displaying its contents.</p>
                                <div className="my-4">
                                    <img
                                        src="/step3_2.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                {/* <div className="mockup-code mt-4 bg-base-300">
                                    <pre data-prefix="$"><code>superapp --version</code></pre>
                                    <pre data-prefix=">" className="text-success"><code>SuperApp v3.2.1 (build 20250331)</code></pre>
                                </div>
                                <div className="alert alert-success mt-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span>Installation successful! You're now ready to use SuperApp.</span>
                                </div>
                                <div className="mt-4">
                                    <button className="btn btn-success">Launch SuperApp</button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    {/* Step 4 */}
                    <div className="step-item flex">
                        <div className="mr-6">
                            <div className="avatar placeholder">
                                <div className="bg-red-500 text-white rounded-full w-12">
                                    <span>4</span>
                                </div>
                            </div>
                            <div className="step-line h-full border-l-2 border-red-500 ml-6 mt-2"></div>
                        </div>
                        <div className="card bg-base-100 shadow-xl flex-1">
                            <div className="card-body">
                                <h3 className="card-title text-xl">Launch MetaTrader5</h3>
                                <p>
                                    Open MetaTrader5.
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step2.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"

                                    />
                                </div>

                                <p>
                                    Open the file, then click "Open Data Folder."
                                </p>

                                <div className="my-4">
                                    <img
                                        src="/step2_2.png"
                                        // className="rounded-lg w-full max-w-md mx-auto shadow-md"
                                        className="rounded-lg w-[calc(50%)] mx-auto shadow-md"
                                    />
                                </div>

                                {/* <div className="mockup-code mt-4">
                                    <pre><code>SuperApp_v3.2.1_setup.exe</code></pre>
                                </div> */}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>
                {`
                    .step-item:last-child .step-line {
                        display: none;
                    }
                `}
            </style>
        </div>
    );
}