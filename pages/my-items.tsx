import { Box, Center, HStack, Spinner, VStack } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import Card from "../src/components/Card/Card";
import GridContent from "../src/components/GridContent";
import { TacoProps } from "../src/components/TacoLayout";
import { ICardInfo } from "../src/hooks/useCardInfo";
import { useMyItems } from "../src/hooks/useMyItems";

export default function myItems(props: TacoProps) {
    const items = useMyItems(props);
    console.log("My items",items)
    return (<GridContent>
        <VStack alignItems="start">
            <Box fontWeight="bold" fontSize="x-large">My Items</Box>
            {items.myCollections.length>0?<HStack alignItems="center" wrap="wrap">{items.myCollections.map((val)=>{
               return val.nfts.map((nft:ICardInfo)=>{
                    return <Card nft={nft} tacoProps={props}></Card>
                })
            })}</HStack>:<Center w={"100%"} padding={10} color="figma.orange" fontWeight="bold"><HStack><Spinner></Spinner><Box>Loading your items</Box></HStack></Center>}
        </VStack>
    </GridContent>)
}