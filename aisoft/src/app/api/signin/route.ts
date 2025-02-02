import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // Find user by email
        const user = await prisma.user.findUnique({ where: { user_email: email } });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.user_password);
        if (!passwordMatch) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful" }, { status: 200 });

    } catch (error) {
        console.error("Sign-in error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
