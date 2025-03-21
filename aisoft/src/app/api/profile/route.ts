import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authSession } from "@/lib/auth"; 

export async function GET() {
    const session = await authSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findFirst({
        where: { user_id: session.user.id ?? "" },
        select: { user_name: true, user_email: true, user_role: true },
    });

    return NextResponse.json(user);
}

export async function POST(req: Request) {
    const session = await authSession();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { user_name, user_email } = await req.json();
    
    const updatedUser = await prisma.user.update({
        where: { user_id: session.user.id ?? "" },
        data: { user_name, user_email },
    });

    return NextResponse.json(updatedUser);
}
