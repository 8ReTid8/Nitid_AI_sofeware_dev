import Link from "next/link";

export default function Nav() {
    return (
        <div className="navbar bg-neutral text-neutral-content">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">DOLLARS</a>
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

                <div className="dropdown dropdown-end">
                    {/* <Link href="/auth/login" className="btn btn-primary btn-outline">sign in</Link> */}
                    <div tabIndex={0} role="button" className="btn btn-ghost font-bold" >
                        Sign in
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
                </div>
            </div>
        </div>
    )
}