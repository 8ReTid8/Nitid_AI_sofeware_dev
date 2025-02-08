// import { authSession } from "@/lib/auth";
// import { prisma } from "@/lib/db";

// export async function GetAcc() {
//     const session = await authSession();
//     try {
//         const getuserId = await prisma.user.findFirst({
//             where: {
//                 user_name: session?.user.name ?? undefined
//             }
//         })
//         if (!getuserId) {
//             throw new Error("User not found");
//         }
//         const list = await prisma.mT5_Acc.findMany({
//             where: { userid: getuserId.user_id }
//         })
//         return list
//     }
//     catch (error) {
//         console.error(error);
//     }
// }
import { prisma } from "@/lib/db";
import { authSession } from "@/lib/auth";

export default async function handler(req: any, res: any) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const session = await authSession();

    try {
        const getuserId = await prisma.user.findFirst({
            where: {
                user_name: session?.user.name ?? undefined,
            },
        });

        if (!getuserId) {
            return res.status(404).json({ message: "User not found" });
        }

        const list = await prisma.mT5_Acc.findMany({
            where: { userid: getuserId.user_id },
        });

        return res.status(200).json(list);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}