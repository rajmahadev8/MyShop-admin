import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const ProductsPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const products = await prismadb.product.findMany({
        where:{
            storeid:params.storeid
        },
        include:{
            category:true,
            size:true,
            color:true
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedProducts: ProductColumn[] = products.map((item)=>({
            id:item.id, 
            name:item.name, 
            isFeatured: item.isFeatured,
            isArchived: item.isArchived,
            price:formatter.format(item.price.toNumber()),
            category:item.category.name,
            size: item.size.name,
            color: item.color.value,
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formatedProducts}/>
            </div>
        </div>
    );
}

export default ProductsPage;