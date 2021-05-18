import { Box, Flex, HStack, VStack, Image, Spinner } from "@chakra-ui/react";
import NextImage from 'next/image'
import React, { useState } from "react";
import GridContent from "../../../src/components/GridContent";
import { TacoProps } from "../../../src/components/TacoLayout";
import { BsArrowLeft } from 'react-icons/bs'
import { useCallback } from "react";
import { ITrait, ICardInfo, useCardInfo } from "../../../src/hooks/useCardInfo";
import router, { useRouter } from "next/router";
import { CardButton } from "../../../src/components/Card/CardButton";
import { useEffect } from "react";
import { getCardType } from "../../../src/components/Card/Card";

export default function Item(props: TacoProps) {
    const router = useRouter();
    const id = Number(router.query.id);
    const collection = router.query.collection as string;
    const { cardInfo, loaded } = useCardInfo(props, collection, id, { useFarmData: true, useMeta: true, useExtras: true })
    props.changeTitle(cardInfo.meta.name)
    const [count, setCount] = useState(0);

    useEffect(() => {
        setCount(count + 1);
    }, [loaded])
    return (<GridContent>
        <Flex w={"100%"} flexDir={["column","column","row"]} marginBottom={5}>

            {loaded && <FullImage loaded={loaded} cardInfo={cardInfo}></FullImage>}
            {loaded && <ItemDescription cardInfo={cardInfo} loaded={loaded} taco={props}></ItemDescription>}

        </Flex>
    </GridContent>)
}
export function WeirdBackground(element: HTMLElement) {
    return <Box position="absolute" backgroundColor="white" height={"100%"} top={0} left={0}></Box>
}
function FullImage(props: { cardInfo: ICardInfo,loaded }) {
    return (<VStack flexGrow={3} spacing={6} minW={"350px"}>
        <HStack boxShadow="figma"
            border="1px solid"
            borderColor="gray.300"
            backgroundColor="white"
            borderRadius="md"
            textAlign="center"
            color="#41B4E6" paddingX={3} paddingY={1}
            fontWeight="semibold">
                <Image src="/icons/Diamante_Icon.svg" w="20px"></Image>
                <Box fontSize="15px" textTransform="capitalize">
                {getCardType(props.cardInfo.farmData?props.cardInfo.farmData.supply:0)} collectible</Box>
                </HStack>

        <Box width="100%" height="100%" backgroundSize="contain" backgroundPosition="center" backgroundRepeat="no-repeat" backgroundImage={"url(" + props.cardInfo.meta.image + ")"}></Box>

        <Box fontWeight="bold" color="gray.400" textAlign="center" cursor="pointer" onClick={()=>{
             window.open("https://opensea.io/assets/" + props.cardInfo.erc1155 + "/" + props.cardInfo.id, "_blank");}
             }>Check on OpenSea</Box>
    </VStack>)
}

function ItemDescription(props: { taco: TacoProps, cardInfo: ICardInfo, loaded }) {
    const [isHoverBack, setHoverBack] = useState(false)
    console.log("Item description", props.cardInfo.farmData);
    console.log("Extras", props.cardInfo.extras);

    return (
        <>
            {props.loaded && props.cardInfo.extras && <VStack flexGrow={4} alignItems="start" paddingLeft={5}>
                <HStack cursor="pointer" fontWeight="semibold" transition="color .5s" color={isHoverBack ? "figma.orange.500" : "gray.500"} 
                onClick={()=>{router.push("/available-pieces")}}
                onPointerEnter={()=>{setHoverBack(true)}}
                onPointerLeave={()=>{setHoverBack(false)}}
                >
      
                    <Box padding={2} borderRadius="full" backgroundColor={isHoverBack ? "figma.orange.50" : "transparent"}>
                        <BsArrowLeft size={25} />
                    </Box>
                    <Box>Back to items</Box>
          
                </HStack>
                <VStack alignItems="start" w={"100%"} padding={5} spacing={7}>
                    <HStack w="100%" >
                        <Box fontSize="xx-large" fontWeight="bold" marginRight={5} color="figma.darkgray">{props.cardInfo.meta.name}</Box>
                        <HStack fontSize="md" color="gray.500"><Box fontWeight="bold">{props.cardInfo.extras ? props.cardInfo.extras.balanceOf : 0}/{props.cardInfo.extras ? props.cardInfo.farmData.supply : 0}</Box> <Box>available</Box></HStack>
                    </HStack>
                    <HStack><Image src={"/icons/" + props.cardInfo.extras.coin + "_Icon.svg"} h={45}></Image>
                        <Box fontWeight="bold" fontSize="xx-large" color="figma.darkgray">{props.cardInfo.extras ? props.cardInfo.extras.pointsPrice : 0}</Box>
                        {props.cardInfo.farmData && Number(props.cardInfo.farmData.prices.totalFee) > 0 &&
                            <HStack fontSize="lg" fontWeight="bold">
                                <Box>+</Box>
                                <Image src="/icons/Eth_Icon.svg" h={30}></Image>
                                <Box>{props.cardInfo.farmData ? props.cardInfo.farmData.prices.totalFeeDecimals : 0}</Box>
                                <Box color="gray.500">to mint</Box>
                            </HStack>
                        }
                    </HStack>
                    <VStack alignItems="start" width="100%" spacing={3}>
                        <Box fontWeight="bold" borderBottom="2px">About the item</Box>
                        <Box maxW={"60%"}>{props.cardInfo.meta.description}</Box>
                    </VStack>
                    <Box fontWeight="bold" color="gray.800">Traits</Box>
                    <Traits loaded={props.loaded} cardInfo={props.cardInfo}></Traits>
                    <CardButton loaded={props.loaded} variant="solid" paddingX={7} taco={props.taco} CardInfo={props.cardInfo}></CardButton>
                </VStack>
            </VStack>}
        </>)
}
function Traits(props: { cardInfo: ICardInfo, loaded: boolean }) {

    return <HStack marginBottom={10} flexWrap="wrap">
        {props.loaded && props.cardInfo.meta.attributes ? props.cardInfo.meta.attributes.map((val) => {

            return <Trait att={val}></Trait>
        }) : <Trait att={{ trait_type: "No traits", value: "" }}></Trait>}
    </HStack>
}
const Trait = (props: { att: ITrait }) => {
    return (<Box backgroundColor="white" boxShadow="figma" fontWeight="semibold" paddingX={3} paddingY={1} marginY={2} borderRadius="lg" color="gray.600">{props.att.trait_type}: {props.att.value}</Box>)
};