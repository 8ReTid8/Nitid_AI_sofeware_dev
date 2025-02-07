import express from "express";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

// const router = express.Router();

// router.get("/account", async (req, res) => {
//     try {
//         const { currency } = req.query;
//         if (!currency) {
//             return res.status(400).json({ error: "Currency is required" });
//         }

//         const models = await prisma.pPO_model.findMany({
//             where: { model_currency: String(currency) },
//             select: { model_id: true, model_name: true }, // Select only necessary fields
//         });

//         res.json(models);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: "Internal server error" });
//     }
// });

// export default router;

// export default async function GetModel(currency: string) {
//     try {
//         const models = await prisma.pPO_model.findMany({
//             where: { model_currency: currency },
//             select: { model_name: true }, // Select only necessary fields
//         });

//         return models
//     } catch (error) {
//         console.error(error);
//         // res.status(500).json({ error: "Internal server error" });
//     }

// }

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const currency = searchParams.get("currency");

        if (!currency) {
            return NextResponse.json({ error: "Currency is required" }, { status: 400 });
        }

        const models = await prisma.pPO_model.findMany({
            where: { model_currency: currency },
            select: { model_id: true, model_name: true }, // Select only necessary fields
        });

        return NextResponse.json(models);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}