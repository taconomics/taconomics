import { Box, Button, Center, Flex, Grid, HStack, Image, Spinner, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { defaultFarms } from '../../../pages/farms';
import Unifty from '../../uniftyLib/UniftyLib';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';
import NextLink from 'next/link'
import { useRouter } from 'next/router';

export const cardWidth = 240;
export const cardHeight = 300;
export default function Card(props: { nft: any, unifty: Unifty, canEdit?,changer}) {

    const nft = props.nft;
    const unifty = props.unifty;

    const [meta, setMeta] = useState({ image: "", name: "", supply: 0, maxSupply: 0, coin: "", price: 0 });
    const [hover, setHover] = useState(false);
    const [valid, setValid] = useState(true);
    if (unifty != undefined && nft != undefined && meta != undefined) {
        useEffect(() => {
            async function func() {

                let realNft = await unifty.getNft(nft.erc1155, nft.id);
                let metaNft = await unifty.getNftMeta(nft.erc1155, nft.id);
                let farmForSupply = unifty.tacoshiFarm;

            

                let farmNftData = await unifty.farmNftData(farmForSupply, nft.erc1155, nft.id);

                if (farmNftData.supply == 0) {
                    farmForSupply = unifty.rabbitFarm;
                    farmNftData = await unifty.farmNftData(farmForSupply, nft.erc1155, nft.id);
                }
               /* console.log("realnft",realNft)
                console.log("metanft",metaNft)

                console.log("farmnftdata",farmNftData)*/

                let price = Number(farmNftData.points) / 1000000000000000000

                let balanceOf = await unifty.balanceOf(nft.erc1155, farmForSupply, nft.id);

                let jsonMeta = await fetch(metaNft).then(r => r.json()).catch(e => { console.error(e) })
                let coin = unifty.getCoinName(farmForSupply);
                if (!jsonMeta) {
                    setValid(false);
                } else {
                    setMeta({ image: jsonMeta.image, name: jsonMeta.name, supply: balanceOf, maxSupply: farmNftData.supply, coin: coin, price: price });
                }

            }

            func();

        }, [props.changer,props.nft])
    }
    return (<EmptyCard setHover={setHover} valid={valid}>
        {meta.image == "" || nft == undefined ?
            <Center><Spinner /></Center> :
            <Flex padding="5px" width={cardWidth + "px"} height={cardHeight + "px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
                <CardTypeBadge></CardTypeBadge>
                <Image maxHeight={cardHeight / 3.4 + "px"} src={meta.image}></Image>
                <Box fontSize="large" textAlign="center" fontWeight="bold">
                    {meta.name}
                </Box>
                {meta.coin != "" &&
                    <HStack>
                        <Box><Coin spacing={0} iconSize="20px" balance={meta.price} img={"/icons/" + meta.coin + "_Icon.svg"}></Coin></Box>
                        <CardAvailable supply={meta.supply} maxSupply={meta.maxSupply}></CardAvailable>

                    </HStack>
                }
                <Box><b>0.1</b> to mint</Box>
                <CardButton unifty={props.unifty}></CardButton>

            </Flex>
        }
        {nft == undefined ?
            <Center><Spinner /></Center> :
            <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={cardHeight / 2.3 + "px"}>
                <Image src={meta.image}></Image>
            </Box>}
        {props.canEdit &&
            <EditCard id={nft.id} height={cardHeight} hover={hover}></EditCard>
        }
    </EmptyCard>)
}
export function EmptyCard(props:{ setHover, children ,valid?}) {
    let { setHover, children ,valid} = props;
    valid = valid==undefined?true:valid;
    setHover = setHover ? setHover : (hover) => { }
    return (
        <Grid  overflow="hidden" position="relative" fontSize="sm" marginLeft={5} marginBottom="25px" templateRows="1fr 1fr" width={cardWidth + "px"}
            backgroundColor="white" height={cardHeight + "px"} borderRadius="15px" boxShadow="base"
            onPointerEnter={() => { setHover(true) }} onPointerLeave={() => { setHover(false) }}
        >
            {children}
        </Grid>
    )
}
function EditCard({ height, hover,id }) {
    const router = useRouter();
    return (
        <Center marginTop={hover ? "0px" : height} position="absolute" backgroundColor="blackAlpha.700" zIndex="10000" width="100%" height="100%">
            <NextLink href={router.asPath+"/items/"+id}><Button variant="outline" colorScheme="figma.white">Edit item</Button></NextLink>
        </Center>
    )
}
function CardButton(props: { unifty: Unifty }) {
    return (<Button variant="outline" colorScheme="figma.orange">Connect to wallet</Button>)
}
function CardAvailable(props: { supply, maxSupply }) {
    return <HStack>{props.supply > 0 ?
        <HStack>
            <Box fontWeight="bold">{props.supply + "/" + props.maxSupply}</Box> <Box fontSize="sm" color="gray">Available</Box>
        </HStack> :
        <Box color="figma.orange.500">Sold out</Box>
    }</HStack>
}

function CardTypeBadge(props) {
    return (<Flex flexDirection="row" backgroundColor="white" borderRadius="md" padding="5px" color="#41b4e6" fontWeight="extrabold">
        <Image marginRight={1} src="/icons/Diamante_Icon.svg"></Image>
        <Box fontSize="small">RARE</Box>
    </Flex>)
}