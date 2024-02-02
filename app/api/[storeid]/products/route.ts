import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// POST API OF PRODUCTS

export async function POST(req:Request, 
    { params }:{ params:{ storeid:string }}) {
    try{    
        const {userId} = auth();
        const body = await req.json();

        const {
            name,
            price,
            categoryid,
            colorid,
            sizeid,
            images,
            isFeatured,
            isArchived
        } = body;

        if(!userId){
            return new NextResponse("Unauthenticated",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!images || !images.length){
            return new NextResponse("Images is required",{status:400});
        }
        if(!price){
            return new NextResponse("Price is required",{status:400});
        }
        if(!categoryid){
            return new NextResponse("Category Id is required",{status:400});
        }
        if(!sizeid){
            return new NextResponse("Size Id is required",{status:400});
        }
        if(!colorid){
            return new NextResponse("Color Id is required",{status:400});
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
        const product = await prismadb.product.create({
            data:{
                name,
                price,
                categoryid,
                colorid,
                sizeid,
                isFeatured,
                isArchived,
                storeid: params.storeid,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        });
        
        
        return NextResponse.json(product);
    }catch(error) {
        console.log(`[PRODUCTS_POST]`,error);
        return new NextResponse("internal error", {status:500});
    }
}

// GET API OF PRODUCTS

export async function GET(req:Request, 
    { params }:{ params:{ storeid:string }}) {
    try{    
        const { searchParams } = new URL(req.url);
        const categoryid = searchParams.get('categoryid') || undefined;
        const colorid = searchParams.get('colorid') || undefined;
        const sizeid = searchParams.get('sizeid') || undefined;
        const isFeatured = searchParams.get('isFeatured');

        if(!params.storeid){
            return new NextResponse("StoreID is required",{status:400});

        }
      
        const products = await prismadb.product.findMany({
            where:{
              storeid:params.storeid,
              categoryid,
              colorid,
              sizeid,
              isFeatured:isFeatured?true:undefined,
              isArchived:false
            },
            include:{
                images:true,
                category:true,
                color:true,
                size:true,
                reviewS:true
            },
            orderBy:{
                createdTime:'desc'
            }
        });
        
        return NextResponse.json(products);
    }catch(error) {
        console.log(`[PRODUCTS_GET]`,error);
        return new NextResponse("internal error", {status:500});
    }
}