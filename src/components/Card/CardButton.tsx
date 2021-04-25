import { Button, chakra } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ICardInfo } from "../../hooks/useCardInfo";
import { TacoProps } from "../TacoLayout";

export function CardButtonSX(props:{taco:TacoProps,CardInfo:ICardInfo}) {
    const [connected,setConnected] = useState(false);
    const router = useRouter();
    const onClick = async()=>{
        if(await props.taco.unifty.isConnected()){
            if(Number(props.CardInfo.extras.balanceOf)>0){
               
            }
        }
    }
    useEffect(()=>{
        async function con(){
            setConnected(await props.taco.unifty.isConnected());
        }
        con();
    },[props.taco.changer])
    return (<Button variant="outline" onClick={onClick} colorScheme="figma.orange" {...props}>{connected?Number(props.CardInfo.extras.balanceOf)>0?"Buy now":"Check on OpenSea":"Connect to wallet"}</Button>)
}
export const CardButton = chakra(CardButtonSX);