import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { format } from "date-fns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({
    params
}:{
    params:{storeid:string}
})=> {
    const orders = await prismadb.order.findMany({
        where:{
            storeid:params.storeid
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            }
        },
        orderBy:{
            createdTime:'desc'
        }
    });
    const formatedOrders: OrderColumn[] = orders.map((item)=>({
            id:item.id, 
            phone:item.phone,
            address:item.address, 
            isPaid:item.isPaid,
            products: item.orderItems.map((orderItem)=>orderItem.product.name).join(', '),
            totalPrice: formatter.format(item.orderItems.reduce((total,item)=>{
                return total + Number(item.product.price);
            },0)),
            createdTime: format(item.createdTime,"MMMM do, yyyy")
    }))
    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formatedOrders}/>
            </div>
        </div>
    );
}

export default OrdersPage;