"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category, Image, Product, Size, Color } from "@prisma/client";
import { Trash } from "lucide-react";
import * as z from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type ProductFormValues = z.infer<typeof formSchema>;

const formSchema = z.object({
    name:z.string().min(1),
    images:z.object({url:z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryid: z.string().min(1),
    sizeid: z.string().min(1),
    colorid: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
})
interface ProductFormProps{
    initialData: Product &{ images: Image[]} | null;
    categories: Category[];
    colors: Color[];
    sizes: Size[];
}

export const ProductForm: React.FC<ProductFormProps> =({initialData, categories, colors, sizes })=> {
    const params = useParams();
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const title = initialData ? "Edit Product" : "Create Product";
    const description = initialData ? "Edit a Product" : "Add a new Product";
    const toastMessage = initialData ? "Product updated." : "Product created.";
    const action = initialData ? "Save Changes" : "Create";


    const form = useForm<ProductFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues:initialData ?{...initialData, price: parseFloat(String(initialData?.price))} : {
            name:'',
            images:[],
            price:0,
            categoryid:'',
            sizeid:'',
            colorid:'',
            isFeatured: false,
            isArchived: false,
        }
    });
    const onSubmit =async (data:ProductFormValues) => {
        try {
            setLoading(true);
            if(initialData){
                await axios.patch(`/api/${params.storeid}/products/${params.productid}`,data)
            }else{
                await axios.post(`/api/${params.storeid}/products`,data)
            }
            router.refresh();
            router.push(`/${params.storeid}/products`);
            toast.success(toastMessage);
        } catch (error) {
            toast.error("Something went wrong.");
        } finally{
            setLoading(false);
        }
    }

    const onDelete = async ()=>{
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeid}/products/${params.productid}`);
            router.refresh();
            router.push(`/${params.storeid}/products`);
            toast.success("Product deleted.");
        } catch (error) {
            toast.error("Something went wrong.");
        } finally{
            setLoading(false);
            setOpen(false);
        }
    }
    return (
    <>
    <AlertModal isOpen={open}
        onClose={()=>setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
    />
    <div className="flex items-center justify-between">
        <Heading title={title} description={description}/>
       { initialData && (
       <Button 
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={()=>setOpen(true)}
            >
            <Trash className="h-4 w-4"/>
        </Button>
        )}
    </div>
    <Separator/> 
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField 
                    control={form.control}
                    name="images"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                 Images
                            </FormLabel>
                            <FormControl>
                                <ImageUpload 
                                    value={field.value.map((image)=>image.url)}
                                    disabled={loading}
                                    onChange={(url)=>field.onChange([...field.value,{url}])}
                                    onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url!==url)])}        
                                />
                            </FormControl>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
            <div className="grid grid-cols-3 gap-8">
                <FormField 
                    control={form.control}
                    name="name"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Product name" {...field}/>
                            </FormControl>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
                 <FormField 
                    control={form.control}
                    name="price"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                Price
                            </FormLabel>
                            <FormControl>
                                <Input type="numeber" disabled={loading} placeholder="900" {...field}/>
                            </FormControl>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
                <FormField 
                    control={form.control}
                    name="categoryid"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                Category
                            </FormLabel>
                            <Select 
                                disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a Category"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category)=>(
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
                <FormField 
                    control={form.control}
                    name="sizeid"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                Size
                            </FormLabel>
                            <Select 
                                disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a Size"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {sizes.map((size)=>(
                                    <SelectItem key={size.id} value={size.id}>
                                        {size.name}
                                    </SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
                <FormField 
                    control={form.control}
                    name="colorid"
                    render={({field})=>{
                       return( <FormItem>
                            <FormLabel>
                                Color
                            </FormLabel>
                            <Select 
                                disabled={loading} 
                                onValueChange={field.onChange} 
                                value={field.value} 
                                defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue defaultValue={field.value} placeholder="Select a Color"/>
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {colors.map((color)=>(
                                    <SelectItem key={color.id} value={color.id}>
                                        {color.name}
                                    </SelectItem>))}
                                </SelectContent>
                            </Select>
                            <FormMessage/> 
                        </FormItem>)
                    }}
                />
                <FormField 
                    control={form.control}
                    name="isFeatured"
                    render={({field})=>{
                       return( <FormItem className="flex flex-row item-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    //@ts-ignore
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Featured
                                </FormLabel>
                                <FormDescription>
                                    This product will appear on Home Page.                               
                                </FormDescription>
                            </div>
                        </FormItem>)
                    }}
                />
                <FormField 
                    control={form.control}
                    name="isArchived"
                    render={({field})=>{
                       return( <FormItem className="flex flex-row item-start space-x-3 space-y-0 rounded-md border p-4">
                           <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    //@ts-ignore
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Archived
                                </FormLabel>
                                <FormDescription>
                                    This product will not appear in the store.                               
                                </FormDescription>
                            </div>
                        </FormItem>)
                    }}
                />
            </div>
            <Button disabled={loading} className="ml-auto" typeof="submit">
                {action}
            </Button>
        </form>
    </Form>
    <Separator/>

    </>
  )
}

