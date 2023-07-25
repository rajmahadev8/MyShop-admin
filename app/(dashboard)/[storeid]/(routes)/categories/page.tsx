import { format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { CategoryClient } from "./components/client";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const categories = await prismadb.category.findMany({
        where:{
            storeid:params.storeid
        },
        include:{
            billboard:true,
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedCategories: CategoryColumn[] = categories.map((item)=>({
            id:item.id, 
            name:item.name, 
            billboardLabel:item.billboard.label,
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formatedCategories}/>
            </div>
        </div>
    );
}

export default CategoriesPage;