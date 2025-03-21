"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    interface User {
        user_name: string;
        user_email: string;
        user_role: string;
    }

    const [user, setUser] = useState<User>({ user_name: "", user_email: "", user_role: "" });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch("/api/profile");
                if (!response.ok) throw new Error("Failed to fetch user data");
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError((error as any).message);
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUser((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(user),
            });
            if (!response.ok) throw new Error("Failed to update profile");
            setSuccessMessage("Profile updated successfully!");
            setIsEditing(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            setError((err as any).message);
        }
    };

    if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    console.log(user?.user_name)
    return (
        <div className="container mx-auto px-4 py-8 max-w-lg">
            <div className="card bg-base-100 shadow-xl p-6">
                <h2 className="text-2xl font-bold mb-4">User Profile</h2>
                {error && <div className="alert alert-error">{error}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-control mb-4">
                        <label className="label">Username</label>
                        <input type="text" name="user_name" value={user?.user_name} onChange={handleChange} disabled={!isEditing} className="input input-bordered" />
                    </div>
                    <div className="form-control mb-4">
                        <label className="label">Email</label>
                        <input type="email" name="user_email" value={user?.user_email} onChange={handleChange} disabled={!isEditing} className="input input-bordered" />
                    </div>
                    <div className="flex justify-end mt-4">
                        {!isEditing ? (
                            <button type="button" onClick={() => setIsEditing(true)} className="btn btn-primary">Edit Profile</button>
                        ) : (
                            <>
                                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary mr-2">Cancel</button>
                                <button type="submit" className="btn btn-success">Save</button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}