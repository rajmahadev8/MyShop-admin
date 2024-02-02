import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(req:Request, 
    { params }:{ params:{productid:string}}) {
    try{    
        const { searchParams } = new URL(req.url);
        // const productid = searchParams.get('productid') || undefined;
      
        const reviews = await prismadb.review.findMany({
            where:{
                productid:params.productid,
            },
            orderBy:{
                createdTime:'desc'
            }
        });
        
        return NextResponse.json(reviews);
    }catch(error) {
        console.log(`[REVIEWS_GET]`,error);
        return new NextResponse("internal error", {status:500});
    }
}