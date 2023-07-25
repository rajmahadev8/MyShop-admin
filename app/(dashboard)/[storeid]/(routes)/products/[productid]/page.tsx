import prismadb from "@/lib/prismadb";
import {ProductForm} from "./components/product-form";

const ProductPage= async({
    params
}:{
    params:{productid:string, storeid:string}
})=> {
    const product = await prismadb.product.findUnique({
        where:{
            id: params.productid
        },
        include:{
            images:true
        }
    })
    const categories = await prismadb.category.findMany({  
        where:{
            storeid:params.storeid
        }
    })
    const sizes = await prismadb.size.findMany({  
        where:{
            storeid:params.storeid
        }
    })
    const colors = await prismadb.color.findMany({  
        where:{
            storeid:params.storeid
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6 p-8">
                <ProductForm initialData={product} categories={categories} colors={colors} sizes={sizes}/>
            </div>
        </div>
    );
}
export default ProductPage;
