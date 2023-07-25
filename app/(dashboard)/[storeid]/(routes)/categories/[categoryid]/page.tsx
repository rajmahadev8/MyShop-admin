import prismadb from "@/lib/prismadb";
import {CategoryForm} from "./components/category-form";

const CategoryPage= async({
    params
}:{
    params:{categoryid:string, storeid:string}
})=> {
    const category = await prismadb.category.findUnique({
        where:{
            id: params.categoryid
        }
    })
    const billboards = await prismadb.billboard.findMany({
        where:{
            storeid:params.storeid
        }
    })
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 pt-6 p-8">
                <CategoryForm initialData={category} billboards={billboards}/>
            </div>
        </div>
    );
}
export default CategoryPage;
