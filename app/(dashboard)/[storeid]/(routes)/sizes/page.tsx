import prismadb from "@/lib/prismadb";
import { SizesClient } from "./components/client";
import { SizeColumn } from "./components/columns";
import { format } from "date-fns";

const SizesPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const sizes = await prismadb.size.findMany({
        where:{
            storeid:params.storeid
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedSizes: SizeColumn[] = sizes.map((item)=>({
            id:item.id, 
            name:item.name, 
            value: item.value,
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SizesClient data={formatedSizes}/>
            </div>
        </div>
    );
}

export default SizesPage;