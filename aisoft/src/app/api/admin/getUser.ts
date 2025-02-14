import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GetUser() {
    try{
        const list = await prisma.user.findMany({
            where: {
                user_role: "user"
            }
        })
        // revalidatePath("../../admin")
        return list
    }
    catch(error){
        console.error(error);
    }
}