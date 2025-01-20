
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server"
export async function Get(req: Request){
    try{
        const body = await req.json();
        const { email,username,password} = body;
        const userExist = await prisma.user.findUnique({
            where: {user_email: email}
        });
 
    } catch(error){

    }
}