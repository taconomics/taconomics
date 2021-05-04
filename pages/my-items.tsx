import { Box, Center, HStack, Spinner, VStack } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import Card from "../src/components/Card/Card";
import GridContent from "../src/components/GridContent";
import Loading from "../src/components/Loading";
import { NoNfts } from "../src/components/NoData";
import { TacoProps } from "../src/components/TacoLayout";
import { ICardInfo } from "../src/hooks/useCardInfo";
import { useMyItems } from "../src/hooks/useMyItems";

export default function myItems(props: TacoProps) {
    const items = useMyItems(props);
    console.log("My items", items)
    const cards = items.myCollections.map((val) => {
        return val.nfts.map((nft: ICardInfo) => {
            return <Card nft={nft} tacoProps={props}></Card>
        })
    })
    return (<GridContent>
        <VStack alignItems="start">
            <Box fontWeight="bold" fontSize="x-large">My Items</Box>

                {items.loaded ? items.myCollections.length > 0 ? <HStack alignItems="center" wrap="wrap">{cards}</HStack> : <NoNfts></NoNfts> : <Loading></Loading>}
  

        </VStack>
    </GridContent>)
}