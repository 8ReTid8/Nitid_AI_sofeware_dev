import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { headers } from 'next/headers';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token || !token.sub) {
        return NextResponse.redirect(new URL('/login', req.url));
    }
    console.log(token)
    try {
        // Call the API to get the latest role
        const response = await fetch(`${req.nextUrl.origin}/api/checkrole`,{headers:req.headers});
        const data = await response.json();

        if (response.ok && data.role === 'ban') {
            return NextResponse.redirect(new URL('/ban', req.url));
        }
        if (response.ok && data.role === 'admin'){
            return NextResponse.redirect(new URL('/admin', req.url));
        }
    } catch (error) {
        console.error('❌ Middleware error:', error);
    }

    return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
    matcher: ['/bot','/accounts'],  
};
