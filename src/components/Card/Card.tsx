import { Box, Button, Center, chakra, Flex, Grid, HStack, Image, Spinner, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { defaultFarms } from '../../../pages/farms';
import Unifty from '../../uniftyLib/UniftyLib';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';
import NextLink from 'next/link'
import { useRouter } from 'next/router';
import { ICardInfo, useCardInfo } from '../../hooks/useCardInfo';
import { TacoProps } from '../TacoLayout';
import { FaRegSadTear } from 'react-icons/fa'
import { CardButton } from './CardButton';
import Loading from '../Loading';
import Twemoji from 'react-twemoji'

export const cardWidth = 240;
export const cardHeight = 300;
export default function Card(props: { nft: any, canEdit?: boolean, tacoProps: TacoProps }) {

    const nft = props.nft ? props.nft : { erc1155: undefined, id: undefined };
    const unifty = props.tacoProps.unifty;
    const [hover, setHover] = useState(false);
    let { cardInfo, loaded } = useCardInfo(props.tacoProps, nft.erc1155, nft.id, { useExtras: true, useFarmData: true, useMeta: true })
    const router = useRouter();
    const goToItem = () => {
        router.push("/items/" + cardInfo.erc1155 + "/" + cardInfo.id)
    }


    return (<EmptyCard setHover={props.canEdit ? setHover : undefined} valid={true}>
        {!loaded ?
            <Loading></Loading> :

            <Flex padding="5px" width={cardWidth + "px"} height={cardHeight + "px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
                <CardTypeBadge maxSupply={cardInfo.nft ? cardInfo.nft.supply : 0}></CardTypeBadge>
                <Image marginTop={10} maxHeight={cardHeight / 3.4 + "px"} cursor="pointer" onClick={goToItem} src={cardInfo.meta.image}></Image>
                <Box cursor="pointer" fontSize="large" textAlign="center" fontWeight="bold" onClick={goToItem}>
                    {cardInfo.meta.name}
                </Box>
                <FarmInfo CardInfo={cardInfo}></FarmInfo>

                <CardButton loaded={loaded} taco={props.tacoProps} CardInfo={cardInfo}></CardButton>

            </Flex>
        }
        {!loaded ?
            <Center><Spinner /></Center> :
            <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={cardHeight / 2.3 + "px"}>
                <Image src={cardInfo.meta.image}></Image>
            </Box>}
        {props.canEdit &&
            <EditCard id={nft.id} height={cardHeight} hover={hover ? hover : undefined}></EditCard>
        }
    </EmptyCard>)
}
export function EmptyCard(props: { setHover, children, valid?}) {
    let { setHover, children, valid } = props;
    valid = valid == undefined ? true : valid;
    setHover = setHover ? setHover : (hover) => { }
    return (
        <Grid overflow="hidden" position="relative" fontSize="sm" marginBottom="25px" templateRows="1fr 1fr" width={cardWidth + "px"}
            backgroundColor="white" height={cardHeight + "px"} borderRadius="15px" boxShadow="figma"
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
            <NextLink href={router.asPath + "/items/" + id}><Button cursor="pointer" variant="outline" colorScheme="figma.white">Edit item</Button></NextLink>
        </Center>
    )
}

function CardAvailable(props: { supply, maxSupply }) {
    return <HStack>{props.supply > 0 ?
        <HStack>
            <Box fontWeight="bold">{props.supply + "/" + props.maxSupply}</Box> <Box fontSize="sm" color="gray">Available</Box>
        </HStack> :
        <Box color="figma.orange.500" fontWeight="bold">Sold out</Box>
    }</HStack>
}
function FarmInfo(props: { CardInfo: ICardInfo }) {
    const { CardInfo } = props;
    return (CardInfo.extras && CardInfo.farmAddress ?
        <Box><HStack>
            <Box><Coin spacing={0} iconSize="20px" balance={CardInfo.extras.pointsPrice} img={"/icons/" + CardInfo.extras.coin + "_Icon.svg"}></Coin></Box>
            <CardAvailable supply={CardInfo.extras.balanceOf} maxSupply={CardInfo.farmData.supply}></CardAvailable>
        </HStack>
            <HStack alignItems="center" justifyContent="center"><Image src="/icons/Eth_Icon.svg" h={5} color="gray.700"></Image> <Box fontWeight="semibold">{props.CardInfo.farmData.prices.totalFeeDecimals}</Box><Box>to mint</Box></HStack>
        </Box>
        :
        <HStack><FaRegSadTear /> <Box> Not available in any farm</Box></HStack>
    )
}

function CardTypeBadge({ maxSupply }) {
    const cardType = getCardType(maxSupply)
    return (<Flex flexDirection="row" backgroundColor="white" alignItems="center" alignContent="center" borderRadius="md" padding="5px" color="#41b4e6" fontWeight="extrabold">

        <Box marginRight={1}><Twemoji options={{ className: 'twemoji', size: "36x36" }}>{CardEmoji[cardType]}</Twemoji></Box>
        <Box fontSize="small">{cardType.toUpperCase()}</Box>
    </Flex>)
}

export const CardTypes = {
    legendary: 1,
    rare: 10,
    regular: 100,
    common: 150
}
export const CardEmoji = {
    legendary: "💎",
    rare: "🌟",
    regular: "🎨",
    common: "📟",
    unknown:"❓"
}

export function getCardType(maxSupply) {
    if (maxSupply == CardTypes.legendary) {
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