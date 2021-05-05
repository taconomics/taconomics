import { Box, Button, Center, Flex, Grid, HStack, Link, LinkBox, UseAccordionReturn } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Card from "../../src/components/Card/Card";
import { columnTemplate, TacoProps } from "../../src/components/TacoLayout";
import { useAsyncNfts, useGetPieces } from "../../src/hooks/useGetPieces";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { getNftsJson } from "./[farm]";

export const defaultFarms = {
    tacoshiFarm: "0xe567c8eE1C362C6CfCb217e43aCfd0F68dC456F2",
    tacoshiRabbit: "0xA6fBbE582D41c6ebbb4ad5803793dcce8662C910",
    maniacom: "0x3b93f48246AE855E3E7001bc338E43C256D7A2dD"
}

export default function FarmIndex(props: TacoProps) {

    const goToFarm = (e) => {
        console.log(e.target.name);
    }
    props.changeTitle("Farms");

    return (<Center flexDir="column">
        <Box>
            ¿Which farm do you want to go?
        </Box>

        <HStack>
            <LinkToFarm address={defaultFarms.tacoshiFarm}>Tacoshi's Farm</LinkToFarm>
            <LinkToFarm address={defaultFarms.tacoshiRabbit}>Tacoshi's Rabbit Quest</LinkToFarm>
            <LinkToFarm address={defaultFarms.maniacom}>(Rinkeby) Mania.com</LinkToFarm>
        </HStack>
    </Center>)
}

export const createFakeCards = (cards: number) => {
    let arr = [];
    for (let a = 0; a < cards; a++) {
        arr.push(<Card tacoProps={undefined} key={a} nft={undefined}></Card>)
    }
    return arr;
}
export function RecentNfts(props: { taco: TacoProps, itemsSize }) {
    const [nextCount, setCount] = useState(0);

    const { nfts } = useAsyncNfts({ minimumNfts: 2, nextCount: nextCount, tacoProps: props.taco }, () => true);//useGetPieces({tacoProps:props.taco,minimumNfts:10,nextCount:1});

    useEffect(() => {
        if (nfts.length <= 10) {
            setCount(nextCount + 1);
        }

    }, [nfts])

    return (<Grid templateColumns={columnTemplate}>
        <Box gridColumn="2/2" >
            <Box fontSize="x-large" marginBottom={5} fontWeight="bold">Recently added pieces</Box>
            <HStack flexWrap="wrap" justifyContent={["center", "center", "left"]} spacing={3}>{nfts ? nfts.map((val, index) => {
                return <Card nft={val.nft} tacoProps={props.taco}></Card>
            }) : <Box>Loading cards</Box>}</HStack>
        </Box>

    </Grid>)
}

const LinkToFarm = ({ children, address }) => {
    return <Link href={"/farms/" + address}>{children}</Link>
}