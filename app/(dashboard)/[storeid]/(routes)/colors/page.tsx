import prismadb from "@/lib/prismadb";
import { ColorsClient } from "./components/client";
import { ColorColumn } from "./components/columns";
import { format } from "date-fns";

const ColorsPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const colors = await prismadb.color.findMany({
        where:{
            storeid:params.storeid
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedColors: ColorColumn[] = colors.map((item)=>({
            id:item.id, 
            name:item.name, 
            value: item.value,
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ColorsClient data={formatedColors}/>
            </div>
        </div>
    );
}

export default ColorsPage;