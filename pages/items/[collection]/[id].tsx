import { Box, Flex, HStack, VStack, Image, Spinner } from "@chakra-ui/react";
import NextImage from 'next/image'
import React from "react";
import GridContent from "../../../src/components/GridContent";
import { TacoProps } from "../../../src/components/TacoLayout";
import { BsArrowLeft } from 'react-icons/bs'
import { useCallback } from "react";
import { IAttribute, ICardInfo, useCardInfo } from "../../../src/hooks/useCardInfo";
import { useRouter } from "next/router";
import { CardButton } from "../../../src/components/Card/CardButton";

export default function Item(props: TacoProps) {
    const router = useRouter();
    const id = Number(router.query.id);
    const collection = router.query.collection as string;
    const CardInfo = useCardInfo(props, collection, id, { useFarmData: true, useMeta: true, useExtras: true })
    console.log("Card info", CardInfo)
    return (<GridContent>
        <Flex w={"100%"} marginBottom={5}>

            {CardInfo.loaded && <FullImage cardInfo={CardInfo}></FullImage>}
            {CardInfo.loaded && <ItemDescription cardInfo={CardInfo} taco={props}></ItemDescription>}

        </Flex>
    </GridContent>)
}
export function WeirdBackground(element: HTMLElement) {
    return <Box position="absolute" backgroundColor="white" height={"100%"} top={0} left={0}></Box>
}
function FullImage(props: { cardInfo: ICardInfo }) {
    return (<VStack flexGrow={3} spacing={6} w={"10%"}>
        <HStack boxShadow="figma"
            border="1px solid"
            borderColor="gray.300"
            backgroundColor="white"
            borderRadius="md"
            textAlign="center"
            color="#41B4E6" paddingX={3} paddingY={1}
            fontWeight="semibold"><Image src="/icons/Diamante_Icon.svg" w="20px"></Image><Box fontSize="15px">Rare collectible</Box></HStack>

        <Box width="100%" height="100%" backgroundSize="contain" backgroundPosition="center" backgroundRepeat="no-repeat" backgroundImage={"url(" + props.cardInfo.meta.image + ")"}></Box>

        <Box fontWeight="bold" color="gray.400" textAlign="center">Check on OpenSea</Box>
    </VStack>)
}

function ItemDescription(props: { taco: TacoProps, cardInfo: ICardInfo }) {
    console.log("Item description", props.cardInfo);
    return (<VStack flexGrow={4} alignItems="start" paddingLeft={5}>
        <HStack><BsArrowLeft /><Box>Back to items</Box></HStack>
        <VStack alignItems="start" w={"100%"} padding={5} spacing={7}>
            <HStack w="100%" >
                <Box fontSize="xx-large" fontWeight="bold" marginRight={5} color="figma.darkgray">{props.cardInfo.meta.name}</Box>
                <HStack fontSize="md" color="gray.500"><Box fontWeight="bold">{props.cardInfo.extras.balanceOf}/{props.cardInfo.farmData.supply}</Box> <Box>available</Box></HStack>
            </HStack>
            <HStack><Image src={"/icons/" + props.cardInfo.extras.coin + "_Icon.svg"} h={45}></Image>
                <Box fontWeight="bold" fontSize="xx-large" color="figma.darkgray">{props.cardInfo.extras.pointsPrice}</Box>
                {props.cardInfo.farmData.prices.totalFee>0 &&
                    <HStack fontSize="lg" fontWeight="bold">
                        <Box>+</Box>
                        <Image src="/icons/Eth_Icon.svg" h={30}></Image>
                        <Box>{props.cardInfo.farmData.prices.totalFeeDecimals}</Box>
                        <Box color="gray.500">to mint</Box>
                    </HStack>
                }
            </HStack>
            <VStack alignItems="start" width="100%" spacing={3}>
                <Box fontWeight="bold" borderBottom="2px">About the item</Box>
                <Box maxW={"60%"}>{props.cardInfo.meta.description}</Box>
            </VStack>
            <Box fontWeight="bold" color="gray.800">Traits</Box>
            <Traits cardInfo={props.cardInfo}></Traits>
            <CardButton variant="solid" paddingX={7} taco={props.taco} CardInfo={props.cardInfo}></CardButton>
        </VStack>
    </VStack>)
}
function Traits(props: { cardInfo: ICardInfo }) {

    return <HStack marginBottom={10} flexWrap="wrap">
        {props.cardInfo.loaded && props.cardInfo.meta.attributes ? props.cardInfo.meta.attributes.map((val) => {

            return <Trait att={val}></Trait>
        }) : <Trait att={{ trait_type: "No traits", value: "" }}></Trait>}
    </HStack>
}
const Trait = (props: { att: IAttribute }) => {
    return (<Box backgroundColor="white" boxShadow="figma" fontWeight="semibold" paddingX={3} paddingY={1} marginY={2} borderRadius="lg" color="gray.600">{props.att.trait_type}: {props.att.value}</Box>)
};