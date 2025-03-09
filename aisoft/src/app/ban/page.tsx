// pages/banned.js
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

export default function BannedPage() {
    const router = useRouter();
    const [countdown, setCountdown] = useState(5);

    // useEffect(() => {
    //     // Countdown timer
    //     const timer = setInterval(() => {
    //         setCountdown((prev) => {
    //             if (prev <= 1) {
    //                 clearInterval(timer);
    //                 router.push('/payment');
    //                 return 0;
    //             }
    //             return prev - 1;
    //         });
    //     }, 1000);

    //     return () => clearInterval(timer);
    // }, [router]);
    useEffect(() => {
        // Countdown timer
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Separate useEffect for navigation based on countdown value
    useEffect(() => {
        if (countdown <= 0) {
            router.push('/payment');
        }
    }, [countdown, router]);

    // Function to handle immediate redirect
    const handleRedirect = () => {
        router.push('/payment');
    };

    // return (
    //     <>
    //         <Head>
    //             <title>Account Suspended - Payment Required</title>
    //             <meta name="description" content="Your account has been suspended due to an outstanding payment." />
    //         </Head>

    //         <div className="min-h-screen bg-base-200 flex items-center justify-center">
    //             <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
    //                 <div className="text-center">
    //                     <div className="bg-error w-16 h-16 mx-auto rounded-full flex items-center justify-center">
    //                         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    //                         </svg>
    //                     </div>

    //                     <h2 className="mt-4 text-2xl font-bold text-error">Account Suspended</h2>
    //                     <p className="mt-2 text-gray-600">Your account has been suspended due to an outstanding payment.</p>

    //                     <div className="divider my-6"></div>

    //                     <div className="alert alert-warning shadow-lg mb-6">
    //                         <div>
    //                             <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
    //                             <span>Your access to our services has been restricted.</span>
    //                         </div>
    //                     </div>

    //                     <p className="mb-6">
    //                         To restore full access to your account, please settle your outstanding payment.
    //                         You will be redirected to the payment page in <span className="font-bold text-error">{countdown}</span> seconds.
    //                     </p>

    //                     <button
    //                         onClick={handleRedirect}
    //                         className="btn btn-error btn-block text-white">
    //                         Pay Now
    //                     </button>

    //                     <p className="mt-4 text-sm text-gray-500">
    //                         If you believe this is an error, please contact our support team at support@example.com
    //                     </p>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // );
    return (
        <>
            <Head>
                <title>Account Suspended - Payment Required</title>
                <meta name="description" content="Your account has been suspended due to an outstanding payment." />
            </Head>

            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="max-w-md w-full p-6 bg-base-100 shadow-xl rounded-lg">
                    <div className="text-center">
                        <div className="bg-error w-16 h-16 mx-auto rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>

                        <h2 className="mt-4 text-2xl font-bold text-error">Account Suspended</h2>
                        <p className="mt-2 text-gray-600">Your account has been suspended due to an outstanding payment.</p>

                        <div className="divider my-6"></div>

                        <div className="alert alert-warning shadow-lg mb-6 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            <span>Your access to our services has been restricted.</span>
                        </div>


                        <p className="mb-6">
                            To restore full access to your account, please settle your outstanding payment.
                            You will be redirected to the payment page in <span className="font-bold text-error">{countdown > 0 ? countdown : 0}</span> seconds.
                        </p>

                        <button
                            onClick={handleRedirect}
                            className="btn btn-error btn-block text-white">
                            Pay Now
                        </button>

                        <p className="mt-4 text-sm text-gray-500">
                            If you believe this is an error, please contact our support team at support@example.com
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}