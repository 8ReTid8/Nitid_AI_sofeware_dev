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
    console.log("Deleting user with ID:", uId);
    try {
        await prisma.bill.deleteMany({
            where: { userid: uId }
        });

        await prisma.mT5_Acc.deleteMany({
            where: { userid: uId }
        });
        const list = await prisma.user.delete({
            where: {
                user_id: uId
            },
        })
    } catch (error) {
        console.log(error)
    }
}