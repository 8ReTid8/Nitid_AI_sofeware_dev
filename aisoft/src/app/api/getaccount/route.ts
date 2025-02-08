import { prisma } from "@/lib/db";
import { authSession } from "@/lib/auth";
import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from "next/server";


export async function GET() {
    // if (req.method !== "GET") {
    //     return res.status(405).json({ message: "Method Not Allowed" });
    // }

    const session = await authSession();

    try {
        const getuserId = await prisma.user.findFirst({
            where: {
                user_name: session?.user.name ?? undefined,
            },
        });

        if (!getuserId) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const list = await prisma.mT5_Acc.findMany({
            where: { userid: getuserId.user_id },
        });

        return NextResponse.json(list, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}