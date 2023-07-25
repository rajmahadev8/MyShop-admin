import prismadb from "@/lib/prismadb";

export const getSalesCount = async(storeid:string)=>{
    const salesCount = await prismadb.order.count({
        where:{
            storeid,
            isPaid:true
        }
    })
    
    return salesCount;
}