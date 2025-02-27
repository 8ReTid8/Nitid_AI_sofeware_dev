// import { prisma } from "@/lib/db";
// import { NextResponse } from "next/server";

// export async function POST(req:Request) {
//     const body = JSON.parse(req.body);
//     const { userId, amount, description, date, type } = body;

//     try {
//         await prisma.bill.create({
//             data: {
//                 userid: userId,
//                 amount: amount,
//                 description: description,
//                 date: date,
//                 type: type
//             }
//         });

//         return NextResponse.json({ message: "Bill created" }, { status: 200 });
//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ message: "Internal server error" }, { status: 500 });
//     }
// }