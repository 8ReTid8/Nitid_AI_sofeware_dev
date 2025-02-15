// import { authSession } from "@/lib/auth";
// import Link from "next/link";
// import SignOut from "./signout";

// export default async function Nav() {
//     const session = await authSession();
//     return (
//         <div className="navbar bg-red-500 text-white">
//             <div className="flex-1">
//                 <Link href="/" className="btn btn-ghost text-xl">
//                     DOLLARS
//                 </Link>
//                 <ul className="menu menu-horizontal px-10">
//                     {session?.user.role === "admin" ? (<></>) : (<>
//                         <li>
//                             <Link href="/bot" className="font-bold text-base">
//                                 Bot
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/accounts" className="font-bold text-base">
//                                 Accounts
//                             </Link>
//                         </li>
//                         <li>
//                             <Link href="/payment" className="font-bold text-base">
//                                 Payment
//                             </Link>
//                         </li></>)}
//                 </ul>
//             </div>
//             <div className="flex-none">
//                 {session?.user ? (
//                     <div className="dropdown dropdown-end">
//                         <div tabIndex={0} role="button" className="btn btn-ghost font-bold" >
//                             {session.user.name}
//                         </div>
//                         <ul
//                             tabIndex={0}
//                             className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
//                             <li>
//                                 <a className="justify-between">
//                                     Profile
//                                 </a>
//                             </li>
//                             {/* <li><a>Settings</a></li> */}
//                             <SignOut />
//                         </ul>
//                     </div>
//                 ) : (
//                     <div role="button" className="btn btn-ghost font-bold" >
//                         <Link href="/login" className="font-bold text-base">
//                             Sign in
//                         </Link>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }

// import { authSession } from "@/lib/auth";
// import SignOut from "./signout";

// export default async function Nav() {
//     const session = await authSession();

//     return (
//         <div className="navbar bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg">
//             <div className="navbar-start">
//                 <div className="dropdown lg:hidden">
//                     <div tabIndex={0} role="button" className="btn btn-ghost">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
//                         </svg>
//                     </div>
//                     <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 text-neutral-800">
//                         {session?.user.role !== "admin" && (
//                             <>
//                                 <li><a href="/bot">Bot</a></li>
//                                 <li><a href="/accounts">Accounts</a></li>
//                                 <li><a href="/payment">Payment</a></li>
//                             </>
//                         )}
//                     </ul>
//                 </div>
//                 <a href="/" className="btn btn-ghost text-xl font-black tracking-wider hover:bg-red-600/20">
//                     DOLLARS
//                 </a>
//             </div>

//             <div className="navbar-center hidden lg:flex">
//                 {session?.user.role !== "admin" && (
//                     <ul className="menu menu-horizontal px-2 gap-2">
//                         <li>
//                             <a href="/bot" className="btn btn-ghost font-semibold hover:bg-red-600/20">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                                 </svg>
//                                 Bot
//                             </a>
//                         </li>
//                         <li>
//                             <a href="/accounts" className="btn btn-ghost font-semibold hover:bg-red-600/20">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
//                                 </svg>
//                                 Accounts
//                             </a>
//                         </li>
//                         <li>
//                             <a href="/payment" className="btn btn-ghost font-semibold hover:bg-red-600/20">
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
//                                 </svg>
//                                 Payment
//                             </a>
//                         </li>
//                     </ul>
//                 )}
//             </div>

//             <div className="navbar-end">
//                 {session?.user ? (
//                     <div className="dropdown dropdown-end">
//                         <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                             <span className="font-semibold">{session.user.name}</span>
//                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
//                             </svg>
//                         </div>
//                         <ul tabIndex={0} className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 shadow-lg p-2 text-neutral-800">
//                             <li>
//                                 <a className="flex items-center gap-2">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                                     </svg>
//                                     Profile
//                                 </a>
//                             </li>
//                             <li>
//                                 <a className="flex items-center gap-2">
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                     </svg>
//                                     Settings
//                                 </a>
//                             </li>
//                             <div className="divider my-1"></div>
//                             <SignOut />
//                         </ul>
//                     </div>
//                 ) : (
//                     <a href="/login" className="btn btn-ghost gap-2 font-semibold hover:bg-red-600/20">
//                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
//                         </svg>
//                         Sign in
//                     </a>
//                 )}
//             </div>
//         </div>
//     );
// }

import { authSession } from "@/lib/auth";
import SignOut from "./signout";

export default async function Nav() {
    const session = await authSession();

    return (
        <div className="navbar bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg">
            <div className="navbar-start">
                {/* Brand/logo */}
                <a href="/" className="btn btn-ghost text-xl font-black tracking-wider hover:bg-red-600/20">
                    DOLLARS
                </a>

                {/* Links on the left side next to "DOLLARS" */}
                {session?.user.role !== "admin" && (
                    <ul className="menu menu-horizontal px-2 gap-2 hidden lg:flex">
                        <li>
                            <a href="/bot" className="btn btn-ghost font-semibold hover:bg-red-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Bot
                            </a>
                        </li>
                        <li>
                            <a href="/accounts" className="btn btn-ghost font-semibold hover:bg-red-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                </svg>
                                Accounts
                            </a>
                        </li>
                        <li>
                            <a href="/payment" className="btn btn-ghost font-semibold hover:bg-red-600/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                </svg>
                                Payment
                            </a>
                        </li>
                    </ul>
                )}
            </div>

            <div className="navbar-end">
                {session?.user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold">{session.user.name}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content menu menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 shadow-lg p-2 text-neutral-800">
                            <li>
                                <a className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Settings
                                </a>
                            </li>
                            <div className="divider my-1"></div>
                            <SignOut />
                        </ul>
                    </div>
                ) : (
                    <a href="/login" className="btn btn-ghost gap-2 font-semibold hover:bg-red-600/20">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V6a3 3 0 013-3h5a3 3 0 013 3v1" />
                        </svg>
                        Login
                    </a>
                )}
            </div>
        </div>
    );
}
