import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST API OF BILLBOARDS

export async function POST(req:Request, 
    { params }:{ params:{ storeid:string }}) {
    try{    
        const {userId} = auth();
        const body = await req.json();

        const {label, imageUrl} = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!label){
            return new NextResponse("Label is required",{status:400});
        }
        if(!imageUrl){
            return new NextResponse("Image URL is required",{status:400});
        }
        if(!params.storeid){
            return new NextResponse("StoreID is required",{status:400});

        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id: params.storeid,
                userId
            }
        });
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:403});
        }
        const billboard = await prismadb.billboard.create({
            data:{
                label,
                imageUrl,
                storeid: params.storeid
            }
        });
        
        
        return NextResponse.json(billboard);
    }catch(error) {
        console.log(`[BILLBOARDS_POST]`,error);
        return new NextResponse("internal error", {status:500});
    }
}

// GET API OF BILLBOARDS

export async function GET(req:Request, 
    { params }:{ params:{ storeid:string }}) {
    try{    
      
        if(!params.storeid){
            return new NextResponse("StoreID is required",{status:400});

        }
      
        const billboard = await prismadb.billboard.findMany({
            where:{
              storeid:params.storeid
            }
        });
        
        
        return NextResponse.json(billboard);
    }catch(error) {
        console.log(`[BILLBOARDS_GET]`,error);
        return new NextResponse("internal error", {status:500});
    }
}