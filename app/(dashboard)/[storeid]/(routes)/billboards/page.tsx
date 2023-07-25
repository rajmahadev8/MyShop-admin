import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";

const BillboardsPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const billboards = await prismadb.billboard.findMany({
        where:{
            storeid:params.storeid
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedBillboards: BillboardColumn[] = billboards.map((item)=>({
            id:item.id, 
            label:item.label, 
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardClient data={formatedBillboards}/>
            </div>
        </div>
    );
}

export default BillboardsPage;