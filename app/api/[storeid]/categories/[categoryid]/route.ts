import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";

import { NextResponse } from "next/server";

// GET API OF INDIVIDUAL CATEGORY

export async function GET(
    req:Request,
    {params}: {
    params:{categoryid:string}}
){
   try {
  
    if(!params.categoryid){
        return new NextResponse("Category ID required",{status:400});
    }
    
    const category = await prismadb.category.findUnique({
        where:{
            id:params.categoryid,
        },
        include:{
            billboard:true
        }
    })
    return NextResponse.json(category);
   } catch (error) {
     console.log(`[CATEGORY_GET]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}

//UPDATE API OF INDIVIDUAL CATEGORY

export async function PATCH(
    req:Request,
    {params}: {
    params:{storeid:string ,categoryid:string}}
){
   try {
    const {userId} = auth();
    const body = await req.json();
    const {name, billboardid} = body;
    if(!userId){
        return new NextResponse("Unauthorized",{status:401});

    }
    if(!name){
        return new NextResponse("Name is required",{status:400});
    }
    if(!billboardid){
        return new NextResponse("Billboard ID is required",{status:400});
    }
    if(!params.categoryid){
        return new NextResponse("Category ID required",{status:400});
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
    const category = await prismadb.category.updateMany({
        where:{
            id:params.categoryid,
        },
        data:{
            name,
            billboardid
        }
    })
    return NextResponse.json(category);
   } catch (error) {
     console.log(`[CATEGORY_PATCH]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}

// DELETE API OF INDIVIDUAL CATEGORY
export async function DELETE(
    req:Request,
    {params}: {
    params:{storeid:string ,categoryid:string}}
){
   try {
    const {userId} = auth();
    
    
    if(!userId){
        return new NextResponse("Unauthorized",{status:401});

    }
    
    if(!params.categoryid){
        return new NextResponse("Category ID required",{status:400});
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
    const category = await prismadb.category.deleteMany({
        where:{
            id:params.categoryid,
            
        },
    })
    return NextResponse.json(category);
   } catch (error) {
     console.log(`[CATEGORY_DELETE]`,error);
     return new NextResponse("Internal Error",{status:500});
   } 
}
