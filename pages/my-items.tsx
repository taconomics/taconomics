import { Box, Center, HStack, Spinner, VStack } from "@chakra-ui/react";
import React from "react";
import { useEffect } from "react";
import Card from "../src/components/Card/Card";
import GridContent from "../src/components/GridContent";
import Loading from "../src/components/Loading";
import { NoNfts } from "../src/components/NoData";
import { TacoProps } from "../src/components/TacoLayout";
import { ICardInfo } from "../src/hooks/useCardInfo";
import { PieceNFT } from "../src/hooks/useGetPieces";
import { useMyItems } from "../src/hooks/useMyItems";

export default function myItems(props: TacoProps) {
    const items = useMyItems(props);
    props.changeTitle("My items")
    const cards = items.nfts.map((nft: PieceNFT) => {
        return <Card nft={nft.nft} tacoProps={props}></Card>
    })
    return (<GridContent>
        <VStack alignItems="start" w="100%">
            <Box fontWeight="bold" fontSize="x-large">My Items</Box>
            <Center w="100%">{!items.loaded && <Loading color="figma.orange.500" customText="Searching your items, please wait..."></Loading>}</Center>
            <HStack alignItems="center" justifyContent="center" wrap="wrap">{cards}</HStack>
            {items.nfts.length <= 0 && items.loaded && <NoNfts></NoNfts>}
            


        </VStack>
    </GridContent>)
}