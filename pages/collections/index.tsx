import { Box, Button, Center, Flex, Grid } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

import styles from './Collections.module.scss';
import { columnTemplate } from '../../src/components/TacoLayout'

export default function Collections({ unifty }) {
    return (<Flex><FeaturedCollections unifty={unifty}></FeaturedCollections></Flex>)
}
export async function getFeaturedCollections(unifty:Unifty) {
    let network = await unifty.getNetwork();
    let featuredCollections;
    if (network === 1) {
        //On Mainet
        featuredCollections = ["0x5d57b91984e4e7d37772c621fc91377a28a7fb1f", "0x2B015207B5259B7fBb80Bb441726305382287674", "0xd5dfb159788856f9fd5f897509d5a68b7b571ea8"]
    } else {
        featuredCollections = ["0x9162E7bAA5239C2eaA1901132DAd5da08730fEd8", "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5"]
    }

    return featuredCollections;


}
export function FeaturedCollections(props: { unifty: Unifty }) {
    let featuredCollections = [];
    let [cards, setCards] = useState(undefined);
    useEffect(() => {

        const func = async () => {
            let network = await props.unifty.getNetwork();
            featuredCollections = await getFeaturedCollections(props.unifty);
            let mCards = []
            for (let i of featuredCollections) {
                mCards.push(<CollectionCard address={i} key={i} unifty={props.unifty}></CollectionCard>)
            }
            setCards(mCards);
        }
        func();
    }, [])

    return (<Grid variant="content">
        <Box fontWeight="bold">Featured Collections</Box>
        <Flex flexWrap="wrap">
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
            
                fetch(metaUri.contractURI).then(r => r.json()).then(e => {
                    console.log("meta", e)
                    setMeta(e);
                })

            })

            // let jsonMeta = await fetch(metaURI.contractURI).then(r => r.json())
        }

    }, [])

    const goToAddress = () => {
        router.push("/collections/" + address)
    }

    return (<Box width={wSize} height={hSize} borderRadius="lg" cursor="pointer" className={styles.collectionCard} overflow="hidden" margin="30px">
        {meta != undefined ?
            <Grid maxW="100%" _hover={{ bgColor: "#000000a0" }} transition=" background-color 1s" onPointerEnter={() => { setHover(true) }} onPointerLeave={() => { setHover(false) }}>
                <Box gridRow="1/1" color="white" gridColumn="1/1" position="relative">
                    <Box position="absolute" width={wSize} bottom="0" padding="5">
                        <Box fontSize="x-large" fontWeight="bold">{meta.name}</Box>
                        <Box maxHeight={isHover ? hSize[0] + "px" : "0"} transition="max-height 1.5s" overflow="hidden">
                            <Box maxHeight={hSize[0] * .60} overflow="hidden">
                                {meta.description}
                            </Box>
                            <Button variant="outline" _hover={{ bgColor: "#ffffff40" }} onClick={goToAddress} marginTop={3}>See collection</Button>
                        </Box>
                    </Box>
                </Box>
                <Flex justifyContent="center" alignContent="center" gridRow="1/1" gridColumn="1/1" width={400} height={hSize} position="relative" zIndex="-10">

                    <Image src={meta.image} layout="fill" className={styles.collectionImage} objectFit="cover"></Image>

                </Flex>

            </Grid>


            : <Box>Loading...</Box>}
    </Box>)
}