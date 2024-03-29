import { Box, Button, Center, Flex, Grid, Spinner, useMediaQuery } from "@chakra-ui/react";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

import styles from './Collections.module.scss';
import { columnTemplate, TacoProps } from '../../src/components/TacoLayout'
import Carousel from 'react-elastic-carousel'
import { BePartTacoCommunity } from "..";
import GridContent from "../../src/components/GridContent";
import { IMetaNft } from "../../src/hooks/useCardInfo";
import { useAsyncNfts, useGetPieces } from "../../src/hooks/useGetPieces";
import Loading from "../../src/components/Loading";

export default function Collections(props: TacoProps) {
    props.changeTitle("Collections")
    return (<>
        <AllCollections taco={props}></AllCollections>
        <BePartTacoCommunity></BePartTacoCommunity>
    </>)
}
export async function getFeaturedCollections(unifty: Unifty) {
    await unifty.isConnected();
    let network = await unifty.getNetwork();
    let featuredCollections;
    console.log("Changer all collections", network)
    if (network === 1) {
        //On Mainet
        featuredCollections = ["0x5d57b91984e4e7d37772c621fc91377a28a7fb1f", "0x2B015207B5259B7fBb80Bb441726305382287674",
            "0xd5dfb159788856f9fd5f897509d5a68b7b571ea8", "0x648e8Bd91e8109CB420c2712382f419f9e9380C7"]
    } else {
        featuredCollections = ["0x9162E7bAA5239C2eaA1901132DAd5da08730fEd8", "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5", "0x477aa01359B87D9c3B00AE6e2bd5670C000d7903"]
    }

    return featuredCollections;


}

export function AllCollections(props: {taco:TacoProps}) {
    let featuredCollections = [];
    let [cards, setCards] = useState<string[]>([]);

    const search = useAsyncNfts({tacoProps:props.taco,minimumNfts:30,nextCount:0},()=>true);
    useEffect(()=>{
        const newCards = [...cards];
        for(let nft of search.nfts){
            if(newCards.indexOf(nft.nft.erc1155)==-1){
                newCards.push(nft.nft.erc1155);
            }
            if(newCards.length>cards.length){
                setCards(newCards);
            }
            
        }

    },[search.nfts])

    return (<GridContent>
        <Box fontWeight="bold" marginBottom={5} fontSize="x-large">All Collections</Box>
       <Center marginY={5}> {!search.loaded&&<Loading color="figma.orange.500" customText="Loading all collections, please wait."></Loading>}</Center>
        <Flex w="100%" flexWrap="wrap">

            {cards.map((value,index)=>{
                return <CollectionCard changer={props.taco.changer} address={value} key={index} unifty={props.taco.unifty}></CollectionCard>
            })}
        </Flex>
    </GridContent>
    )
}
export function FeaturedCollections(props: { unifty: Unifty, changer }) {
    let featuredCollections = [];
    let [cards, setCards] = useState([]);
    const [isTablet] = useMediaQuery("(max-width: 1124px)")
    const [isMobile] = useMediaQuery("(max-width: 768px)")

    let itemsToShow = isTablet ? isMobile ? 1 : 2 : 4;
    useEffect(() => {

        const func = async () => {
            let network = await props.unifty.getNetwork();
            featuredCollections = await getFeaturedCollections(props.unifty);
            let mCards = []
            if (featuredCollections) {
                for (let i of featuredCollections) {
                    mCards.push(<CollectionCard changer={props.changer} address={i} key={i} unifty={props.unifty}></CollectionCard>)
                }
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

export function CollectionCard(props: { address, unifty: Unifty, changer }) {
    const { address, unifty, changer } = props;
    let wSize = [260];
    let hSize = [330];

    const [meta, setMeta] = useState<IMetaNft>(undefined);
    const [isHover, setHover] = useState(false);
    const router = useRouter();
    useEffect(() => {

        async function func() {
            let meta = await (unifty as Unifty).getErc1155Meta(address)
            let realmeta = await unifty.readUri(meta.contractURI)
            setMeta(realmeta);
        }
        func();

    }, [changer, address])

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