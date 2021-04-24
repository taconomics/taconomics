import { Box, Button, Center, Flex, Grid, HStack, Image, Spinner, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { defaultFarms } from '../../../pages/farms';
import Unifty from '../../uniftyLib/UniftyLib';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { ICardInfo, useCardInfo } from '../../hooks/useCardInfo';
import { TacoProps } from '../TacoLayout';
import {FaRegSadTear} from 'react-icons/fa'

export const cardWidth = 240;
export const cardHeight = 300;
export default function Card(props: { nft: any, canEdit?: boolean, tacoProps: TacoProps }) {

    const nft = props.nft ? props.nft : { erc1155: undefined, id: undefined };
    const unifty = props.tacoProps.unifty;
    const [hover, setHover] = useState(false);
    let CardInfo: ICardInfo = useCardInfo(props.tacoProps, nft.erc1155, nft.id, { useExtras: true, useFarmData: true, useMeta: true })
    return (<EmptyCard setHover={setHover} valid={true}>
        {CardInfo.meta != undefined && nft == undefined ?
            <Center><Spinner /></Center> :
            <Flex padding="5px" width={cardWidth + "px"} height={cardHeight + "px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
                <CardTypeBadge maxSupply={CardInfo.nft.maxSupply}></CardTypeBadge>
                <Image maxHeight={cardHeight / 3.4 + "px"} src={CardInfo.meta.image}></Image>
                <Box fontSize="large" textAlign="center" fontWeight="bold">
                    {CardInfo.meta.name}
                </Box>
                <FarmInfo CardInfo={CardInfo}></FarmInfo>

                <CardButton unifty={props.tacoProps.unifty}></CardButton>

            </Flex>
        }
        {CardInfo != undefined && nft == undefined ?
            <Center><Spinner /></Center> :
            <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={cardHeight / 2.3 + "px"}>
                <Image src={CardInfo.meta.image}></Image>
            </Box>}
        {props.canEdit &&
            <EditCard id={nft.id} height={cardHeight} hover={hover}></EditCard>
        }
    </EmptyCard>)
}
export function EmptyCard(props: { setHover, children, valid?}) {
    let { setHover, children, valid } = props;
    valid = valid == undefined ? true : valid;
    setHover = setHover ? setHover : (hover) => { }
    return (
        <Grid overflow="hidden" position="relative" fontSize="sm" marginBottom="25px" templateRows="1fr 1fr" width={cardWidth + "px"}
            backgroundColor="white" height={cardHeight + "px"} borderRadius="15px" boxShadow="base"
            onPointerEnter={() => { setHover(true) }} onPointerLeave={() => { setHover(false) }}
        >
            {children}
        </Grid>
    )
}
function EditCard({ height, hover, id }) {
    const router = useRouter();
    return (
        <Center marginTop={hover ? "0px" : height} position="absolute" backgroundColor="blackAlpha.700" zIndex="10000" width="100%" height="100%">
            <NextLink href={router.asPath + "/items/" + id}><Button variant="outline" colorScheme="figma.white">Edit item</Button></NextLink>
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
function FarmInfo(props: { CardInfo: ICardInfo }) {
    const { CardInfo } = props;
    return (CardInfo.extras != undefined ?
        <Box><HStack>
            <Box><Coin spacing={0} iconSize="20px" balance={CardInfo.extras.price} img={"/icons/" + CardInfo.extras.coin + "_Icon.svg"}></Coin></Box>
            <CardAvailable supply={CardInfo.extras.balanceOf} maxSupply={CardInfo.farmData.supply}></CardAvailable>
        </HStack>
            <Box><b>0.1</b> to mint</Box>
        </Box>
        :
        <HStack><FaRegSadTear/> <Box> Not available in any farm</Box></HStack>
    )
}

function CardTypeBadge({ maxSupply }) {
    return (<Flex flexDirection="row" backgroundColor="white" borderRadius="md" padding="5px" color="#41b4e6" fontWeight="extrabold">
        <Image marginRight={1} src="/icons/Diamante_Icon.svg"></Image>
        <Box fontSize="small">{getCardType(maxSupply).toUpperCase()}</Box>
    </Flex>)
}

export const CardTypes = {
    legendary: 1,
    rare: 10,
    regular: 100,
    common: 150
}

export function getCardType(maxSupply) {
    if (maxSupply === CardTypes.legendary) {
        return "legendary"
    } else if (maxSupply == CardTypes.rare) {
        return "rare"
    } else if (maxSupply == CardTypes.regular) {
        return "regular"
    } else if (maxSupply >= CardTypes.common) {
        return "common"
    } else {
        return "unknown"
    }
}