import { useRouter } from "next/navigation";

export default function DelAccount({ AccId }: { AccId: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this account?");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/deleteAccount`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accountId:AccId }),
            });

            if (!response.ok) {
                throw new Error("Failed to delete account");
            }

            alert("Account deleted successfully");
            router.push("/accounts"); // Refresh the page to reflect changes
        } catch (error) {
            console.error("Error deleting account:", error);
            alert("Error deleting account. Please try again.");
        }
    };
    return (
        <button className="btn btn-error gap-2" onClick={handleDelete}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            </svg>
            Delete
        </button>
    )
}