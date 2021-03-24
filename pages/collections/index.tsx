import { Box, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

import styles from './Collections.module.scss';


export default function Collections(unifty: Unifty) {
    return (<Flex>Collections index</Flex>)
}

export function FeaturedCollections({ unifty }) {
    let featuredCollections = ["0x9162E7bAA5239C2eaA1901132DAd5da08730fEd8", "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5"]
    let cards = [];

    for (let i of featuredCollections) {
        cards.push(<CollectionCard address={i} key={i} unifty={unifty}></CollectionCard>)
    }

    return (<Box>
        <Box fontWeight="bold">Featured Collections</Box>
        <Flex>
           {cards} 
        </Flex>
        
    </Box>)
}

export function CollectionCard({ address, unifty }) {
    let wSize = [200];
    let hSize = [300];

    const [meta, setMeta] = useState(undefined);
    useEffect(() => {
        if (address != undefined) {
            (unifty as Unifty).getErc1155Meta(address).then(metaUri => {
                console.log(metaUri);
                fetch(metaUri.contractURI).then(r => r.json()).then(e=>{
                    console.log("meta",e)
                    setMeta(e);
                })
                
            })
          
            // let jsonMeta = await fetch(metaURI.contractURI).then(r => r.json())
        }

    }, [])

    return (<Box width={wSize} height={hSize} borderRadius="lg" className={styles.collectionCard} overflow="hidden" margin="30px">
        {meta!=undefined?
        <Grid>
            <Box  gridRow="1/1" color="white" gridColumn="1/1" position="relative">
                <Box position="absolute" bottom="0" padding="5">
                {meta.name}
                </Box>
            </Box>
            <Box gridRow="1/1" gridColumn="1/1" width={300} height={hSize} position="relative" zIndex="-10">
            
            <Image src={meta.image} layout="fill" objectFit="cover"></Image>
           
           </Box> 
           
        </Grid>
        
        
        :<Box>Loading...</Box>}
    </Box>)
}