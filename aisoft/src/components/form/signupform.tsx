import { z } from "zod"

export default function SignUpForm() {
    // const onSubmit = async (value: z.infer<typeof FormSchema>) => {
    
    return (
        <div className="form-control">
            <h1 className="text-4xl">Sign up</h1>
            <form className="form-control">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input type="email" placeholder="Email" className="input input-bordered" />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input type="password" placeholder="Password" className="input input-bordered" />
                </div>
                <div className="form-control">
                    <button className="btn btn-primary">Sign up</button>
                </div>
            </form>
        </div>
    )
}