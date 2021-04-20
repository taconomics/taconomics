import { Box, Button, Center, Flex, Grid, Spinner, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

import styles from './Collections.module.scss';
import { columnTemplate } from '../../src/components/TacoLayout'
import Carousel from 'react-elastic-carousel'
import { BePartTacoCommunity } from "..";
import GridContent from "../../src/components/GridContent";

export default function Collections({ unifty,changer }) {
    return (<>
            <AllCollections changer={changer} unifty={unifty}></AllCollections>
        <BePartTacoCommunity></BePartTacoCommunity>
    </>)
}
export async function getFeaturedCollections(unifty: Unifty) {
    await unifty.isConnected();
    let network = await unifty.getNetwork();
    let featuredCollections;
    console.log("Changer all collections",network)
    if (network === 1) {
        //On Mainet
        featuredCollections = ["0x5d57b91984e4e7d37772c621fc91377a28a7fb1f", "0x2B015207B5259B7fBb80Bb441726305382287674",
            "0xd5dfb159788856f9fd5f897509d5a68b7b571ea8", "0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb"]
    } else {
        featuredCollections = ["0x9162E7bAA5239C2eaA1901132DAd5da08730fEd8", "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5"]
    }

    return featuredCollections;


}

export function AllCollections(props: { unifty: Unifty ,changer}) {
    let featuredCollections = [];
    let [cards, setCards] = useState(undefined);
    useEffect(() => {

        const func = async () => {
            featuredCollections = await getFeaturedCollections(props.unifty);
            let mCards = []
            for (let i of featuredCollections) {
                mCards.push(<CollectionCard changer={props.changer} address={i} key={i} unifty={props.unifty}></CollectionCard>)
            }
            setCards(mCards);
        }
        func();
    }, [props.changer])

    return (<GridContent>
        <Box fontWeight="bold" marginBottom={5} fontSize="x-large">All Collections</Box>
        <Flex w="100%" flexWrap="wrap">

            {cards}
        </Flex>
    </GridContent>
    )
}
export function FeaturedCollections(props: { unifty: Unifty,changer }) {
    let featuredCollections = [];
    let [cards, setCards] = useState(undefined);
    const [isTablet] = useMediaQuery("(max-width: 1124px)")
    const [isMobile] = useMediaQuery("(max-width: 768px)")

    let itemsToShow = isTablet ? isMobile ? 1 : 2 : 4;
    useEffect(() => {

        const func = async () => {
            let network = await props.unifty.getNetwork();
            featuredCollections = await getFeaturedCollections(props.unifty);
            let mCards = []
            for (let i of featuredCollections) {
                mCards.push(<CollectionCard changer={props.changer} address={i} key={i} unifty={props.unifty}></CollectionCard>)
            }
            setCards(mCards);
        }
        func();
    }, [props.changer])

    return (<Grid variant="content" templateColumns={columnTemplate}>

        <Box gridColumn="2/2">
            <Box fontWeight="bold" marginBottom={5} fontSize="x-large">Featured Collections</Box>
            <Flex flexWrap="wrap">
                <Carousel itemsToShow={itemsToShow} isRTL={false} showArrows={false}>
                    {cards}
                </Carousel>
            </Flex>
        </Box>



    </Grid>)
}

export function CollectionCard({ address, unifty,changer }) {
    let wSize = [260];
    let hSize = [330];

    const [meta, setMeta] = useState(undefined);
    const [isHover, setHover] = useState(false);
    const router = useRouter();
    useEffect(() => {
        if (address != undefined) {
            
            (unifty as Unifty).getErc1155Meta(address).then(metaUri => {

                fetch(metaUri.contractURI).then(r => r.json()).then(e => {
                    setMeta(e);
                }).catch(e => { console.error(e) })

            })

        }

    }, [changer,address])

    const goToAddress = () => {
        router.push("/collections/" + address)
    }

    return (<Box width={wSize} minW={wSize} marginBottom="5px" marginRight={5} height={hSize} borderRadius="lg" cursor="pointer" className={styles.collectionCard} overflow="hidden" >
        {meta != undefined ?
            <Grid maxW="100%" _hover={{ bgColor: "#000000a0" }} transition=" background-color 1s" onPointerEnter={() => { setHover(true) }} onPointerLeave={() => { setHover(false) }}>
                <Box gridRow="1/1" color="white" gridColumn="1/1" position="relative">
                    <Box position="absolute" width={wSize} bottom="0" padding="5">
                        <Box fontSize="x-large" fontWeight="bold">{meta.name}</Box>
                        <Box maxHeight={isHover ? hSize[0] + "px" : "0"} transition="max-height 1.5s" overflow="hidden">
                            <Box maxHeight={hSize[0] * .50} overflow="hidden">
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


            : <Center><Spinner></Spinner></Center>}
    </Box>)
}