"use client";

import { useStoreModal } from "@/hooks/use-store-modal";
import { useEffect } from "react";

function SetupPage() {
  const isOpen = useStoreModal((state)=>state.isOpen);
  const onOpen = useStoreModal((state)=>state.onOpen);
  useEffect(() => {
    if(!isOpen){
      onOpen();
    } 
  }, [isOpen,onOpen]);
  

    return null;
    
  }
  export default SetupPage;  