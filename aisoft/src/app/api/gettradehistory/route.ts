// pages/api/trade-history.js
import { NextResponse } from "next/server";

export default async function GET(req: Request) {
    try{
        const tradeHistory = await req.json()
        console.log(tradeHistory)
        return NextResponse.json(tradeHistory, { status: 200 });
    }catch(error){
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    // return res.status(405).json({ error: "Method Not Allowed" });
}
