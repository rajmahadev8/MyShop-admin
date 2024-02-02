import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// GET API OF INDIVIDUAL PRODUCT

export async function GET(
    req:Request,
    {params}: {
    params:{productid:string}}
){
   try {
  
    if(!params.productid){
        return new NextResponse("Product ID required",{status:400});
    }
    
    const product = await prismadb.product.findUnique({
        where:{
            id:params.productid,
        },
        include:{
            images:true,
            category:true,
            size:true,
            color:true,
            reviewS:{
                orderBy:{
                    createdTime:'desc'
                }
            }
        }
    })
    return NextResponse.json(product);
   } catch (error) {
     console.log(`[PRODUCT_GET]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}

//UPDATE API OF INDIVIDUAL PRODUCT

export async function PATCH(
    req:Request,
    {params}: {
    params:{storeid:string ,productid:string}}
){
   try {
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
        return new NextResponse("Unauthorized",{status:401});

    }
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
    if(!params.productid){
        return new NextResponse("Product ID required",{status:400});
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
    await prismadb.product.update({
        where:{
            id:params.productid,
        },
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
                deleteMany:{}
            }
        }
    })
    const product = await prismadb.product.update({
        where:{
            id: params.productid
        },
        data:{
            images:{
                createMany:{
                    data:[
                        ...images.map((image:{url:string})=>image)
                    ]
                }
            }
        }
    })
    return NextResponse.json(product);
   } catch (error) {
     console.log(`[PRODUCT_PATCH]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}

// DELETE API OF INDIVIDUAL PRODUCT
export async function DELETE(
    req:Request,
    {params}: {
    params:{storeid:string ,productid:string}}
){
   try {
    const {userId} = auth();
    
    
    if(!userId){
        return new NextResponse("Unauthorized",{status:401});

    }
    
    if(!params.productid){
        return new NextResponse("Product ID required",{status:400});
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
    const product = await prismadb.product.deleteMany({
        where:{
            id:params.productid,
            
        },
    })
    return NextResponse.json(product);
   } catch (error) {
     console.log(`[PRODUCT_DELETE]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}
