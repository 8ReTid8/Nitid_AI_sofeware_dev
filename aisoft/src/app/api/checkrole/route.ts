// pages/api/auth/user-role.ts
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/db';
import { authSession } from '@/lib/auth';
import { NextResponse, NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    // const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    
    const token = await authSession()
    console.log(token)
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = await prisma.user.findFirst({
            where: { user_id: token.user.id },
            select: { user_role: true },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ role: user.user_role }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user role:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
