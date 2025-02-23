import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const user_id = url.searchParams.get("userId");
    console.log(user_id)
    try {
        const usertarget = await prisma.user.findFirst({
            where: { user_id: user_id ?? undefined },
            include: {
                mt5_accounts: true,
                bill: true,
            },
        })
        return NextResponse.json(usertarget, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}