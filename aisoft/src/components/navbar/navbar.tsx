import { authSession, authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import SignOut from "./signout";

export default async function Nav() {
    const session = await authSession();
    return (
        <div className="navbar bg-red-500 text-white">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    DOLLARS
                </Link>
                <ul className="menu menu-horizontal px-10">
                    {session?.user.role === "admin" ? (<></>) : (<>
                        <li>
                            <Link href="/bot" className="font-bold text-base">
                                Bot
                            </Link>
                        </li>
                        <li>
                            <Link href="/accounts" className="font-bold text-base">
                                Accounts
                            </Link>
                        </li>
                        <li>
                            <Link href="/payment" className="font-bold text-base">
                                Payment
                            </Link>
                        </li></>)}
                    {/* <li>
                        <Link href="/bot" className="font-bold text-base">
                            Bot
                        </Link>
                    </li>
                    <li>
                        <Link href="/accounts" className="font-bold text-base">
                            Accounts
                        </Link>
                    </li>
                    <li>
                        <Link href="/payment" className="font-bold text-base">
                            Payment
                        </Link>
                    </li> */}
                </ul>
            </div>
            <div className="flex-none">
                {session?.user ? (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost font-bold" >
                            {session.user.name}
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow text-black">
                            <li>
                                <a className="justify-between">
                                    Profile
                                </a>
                            </li>
                            <li><a>Settings</a></li>
                            {/* <li onClick={() =>}><a>Logout</a></li> */}
                            <SignOut />
                        </ul>
                    </div>
                ) : (
                    <div role="button" className="btn btn-ghost font-bold" >
                        <Link href="/login" className="font-bold text-base">
                            Sign in
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}