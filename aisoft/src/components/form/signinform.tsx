// export default function SignInForm() {
//     return (
//         <div className="form-control">
//             <h1 className="text-4xl">Sign in</h1>
//             <form className="form-control">
//                 <div className="form-control">
//                     <label className="label">
//                         <span className="label-text">Email</span>
//                     </label>
//                     <input type="email" placeholder="Email" className="input input-bordered" />
//                 </div>
//                 <div className="form-control">
//                     <label className="label">
//                         <span className="label-text">Password</span>
//                     </label>
//                     <input type="password" placeholder="Password" className="input input-bordered" />
//                 </div>
//                 <div className="form-control">
//                     <button className="btn btn-primary">Sign in</button>
//                 </div>
//             </form>
//         </div>
//     )
// }

import Link from "next/link";

export default function SignInForm() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-2xl">
                <h1 className="text-3xl font-semibold text-center text-gray-800">Sign In</h1>
                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input 
                            type="password" 
                            placeholder="Enter your password" 
                            className="w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-400"
                    >
                        Sign In hi
                    </button>
                    <div className="text-center text-sm text-gray-600">
                        Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}