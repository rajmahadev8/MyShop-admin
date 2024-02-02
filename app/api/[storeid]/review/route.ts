import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST API OF REVIEW

export async function POST(req:Request, 
    { params }:{ params:{ }}) {
    try{    
        // const {userId} = auth();
        const body = await req.json();

        const {
            name,
            description,
            productid,
        } = body;

        // if(!userId){
        //     return new NextResponse("Unauthenticated",{status:401});
        // }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!description){
            return new NextResponse("description is required",{status:400});
        }
        // if(!params.storeid){
        //     return new NextResponse("StoreID is required",{status:400});

        // }
        // const storeByUserId = await prismadb.store.findFirst({
        //     where:{
        //         id: params.storeid,
        //         userId
        //     }
        // });
        // if(!storeByUserId){
        //     return new NextResponse("Unauthorized",{status:403});
        // }
        const review = await prismadb.review.create({
            data:{
                name,
                description,
                productid:productid
            }
        });
        return NextResponse.json(review);
    }catch(error) {
        console.log(`[REVIEW_POST]`,error);
        return new NextResponse("internal error", {status:500});
    }
}

// GET API OF REVIEW

// export async function GET(req:Request, 
//     { params }:{ params:{}}) {
//     try{    
//         const { searchParams } = new URL(req.url);
//         const productid = searchParams.get('productid') || undefined;
      
//         const reviews = await prismadb.review.findMany({
//             where:{
//                 productid:productid,
//             },
//             orderBy:{
//                 createdTime:'desc'
//             }
//         });
        
//         return NextResponse.json(reviews);
//     }catch(error) {
//         console.log(`[REVIEWS_GET]`,error);
//         return new NextResponse("internal error", {status:500});
//     }
// }