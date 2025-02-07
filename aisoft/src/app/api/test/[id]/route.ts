import { NextResponse } from "next/server"

export async function GET(res:Request,{ params }: { params: Promise<{ id: string }>}) {
    const {id} = await params
    console.log("GET")
    return NextResponse.json({})
}

export async function PUT(res:Request,{ params }: { params: Promise<{ id: string }>}) {
    const {id} = await params
    console.log("PUT",id)
    return NextResponse.json({})
}