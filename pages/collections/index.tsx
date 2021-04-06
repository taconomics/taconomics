import { Box, Button, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

import styles from './Collections.module.scss';
import { columnTemplate } from '../../src/components/TacoLayout'

export default function Collections({unifty}) {
    return (<Flex><FeaturedCollections unifty={unifty}></FeaturedCollections></Flex>)
}

export function FeaturedCollections({ unifty }) {
    let featuredCollections = ["0x9162E7bAA5239C2eaA1901132DAd5da08730fEd8", "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5"]
    let cards = [];

    for (let i of featuredCollections) {
        cards.push(<CollectionCard address={i} key={i} unifty={unifty}></CollectionCard>)
    }

    return (<Grid variant="content">
        <Box fontWeight="bold">Featured Collections</Box>
        <Flex>
            {cards}
        </Flex>

    </Grid>)
}

export function CollectionCard({ address, unifty }) {
    let wSize = [260];
    let hSize = [330];

    const [meta, setMeta] = useState(undefined);
    const [isHover, setHover] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (address != undefined) {
            (unifty as Unifty).getErc1155Meta(address).then(metaUri => {
                console.log(metaUri);
                fetch(metaUri.contractURI).then(r => r.json()).then(e => {
                    console.log("meta", e)
                    setMeta(e);
                })

            })

            // let jsonMeta = await fetch(metaURI.contractURI).then(r => r.json())
        }

    }, [])

    const goToAddress = ()=>{
        router.push("/collections/"+address)
    }

    return (<Box width={wSize} height={hSize} borderRadius="lg" cursor="pointer" className={styles.collectionCard} overflow="hidden" margin="30px">
        {meta != undefined ?
            <Grid _hover={{ bgColor: "#000000a0" }} transition=" background-color 1s" onPointerEnter={() => { setHover(true) }} onPointerLeave={() => { setHover(false) }}>
                <Box gridRow="1/1" color="white" gridColumn="1/1" position="relative">
                    <Box position="absolute" bottom="0" padding="5">
                        <Box fontSize="x-large" fontWeight="bold">{meta.name}</Box>
                        <Box maxHeight={isHover ? hSize[0] + "px" : "0"} transition="max-height 1.5s" overflow="hidden">
                            <Box maxHeight={hSize[0]*.60} overflow="hidden">
                                {meta.description}
                            </Box>
                            <Button variant="outline" _hover={{bgColor:"#ffffff40"}} onClick={goToAddress} marginTop={3}>See collection</Button>
                        </Box>
                    </Box>
                </Box>
                <Box gridRow="1/1" gridColumn="1/1" width={400} height={hSize} position="relative" zIndex="-10">

                    <Image src={meta.image} layout="fill" objectFit="cover"></Image>

                </Box>

            </Grid>


            : <Box>Loading...</Box>}
    </Box>)
}