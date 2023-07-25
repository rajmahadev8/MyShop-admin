"use client";

import { UseOrigin } from "@/hooks/use-origin";
import { useParams } from "next/navigation";
import { ApiAlert } from "./api-alert";

interface ApiListProps{
    entityName: string;
    entityIdName: string
}

export const ApiList: React.FC<ApiListProps> = ({
    entityName,
    entityIdName,
}) => { 
    const params = useParams();
    const origin = UseOrigin();

    const baseUrl = `${origin}/api/${params.storeid}`
    return(
        <>
          <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="GET"
                variant="public"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert 
                title="POST"
                variant="admin"
                description={`${baseUrl}/${entityName}`}
            />
            <ApiAlert 
                title="PATCH"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
            <ApiAlert 
                title="Delete"
                variant="admin"
                description={`${baseUrl}/${entityName}/{${entityIdName}}`}
            />
             
             
        </>
    )
 }