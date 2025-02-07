import { NextResponse } from "next/server"

export async function GET(res:Request) {
    const {searchParams} = new URL(res.url)
    const currency = searchParams.get("the");
    console.log(searchParams)
    console.log(currency)
    return NextResponse.json({})
}