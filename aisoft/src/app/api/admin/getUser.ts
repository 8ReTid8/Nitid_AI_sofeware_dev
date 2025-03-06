"use server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function GetUser() {
    try {
        const list = await prisma.user.findMany({
            include: {
                bill: true
            }
        })
        return list
    }
    catch (error) {
        console.error(error);
    }
}

export async function DeleteUser(uId: string) {
    try {
        const list = await prisma.user.update({
            where: {
                user_id: uId
            },
            data: {
                user_role: "delete"
            }
        })
    } catch (error) {
        console.log(error)
    }
}