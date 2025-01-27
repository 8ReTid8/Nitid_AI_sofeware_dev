import Link from "next/link";

export default function Nav() {
    return (
        <div className="navbar bg-red-500 text-white">
            <div className="flex-1">
                <Link href="/" className="btn btn-ghost text-xl">
                    DOLLARS
                </Link>
                <ul className="menu menu-horizontal px-10">
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
                    </li>
                </ul>
            </div>
            <div className="flex-none">
                <div role="button" className="btn btn-ghost font-bold" >
                    <Link href="/auth/login" className="font-bold text-base">
                        Sign in
                    </Link>
                </div>
                {/* <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost font-bold" >
                        <Link href="/auth/login" className="font-bold text-base">
                            Sign in
                        </Link>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li>
                            <a className="justify-between">
                                Profile
                            </a>
                        </li>
                        <li><a>Settings</a></li>
                        <li><a>Logout</a></li>
                    </ul>
                </div> */}
            </div>
        </div>
    )
}