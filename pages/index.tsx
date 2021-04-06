import { Box, Button, Center, color, Flex, Grid } from '@chakra-ui/react'
import Head from 'next/head'
import React from 'react'
import Image from 'next/image'
import { columnTemplate } from '../src/components/TacoLayout'
import Carousel from 'react-elastic-carousel'
import { FeaturedCollections } from './collections'
import { RecentNfts } from './farms'
export default function Home({unifty}) {
  return (
    <Flex flexDirection="column">
      <Box width="100%" >
        <HomeStart></HomeStart>
      </Box>
      <FeaturedCollections unifty={unifty}></FeaturedCollections>
      <RecentNfts unifty={unifty} itemsSize="9"></RecentNfts>
      <AboutNFTS></AboutNFTS>
      <BePartTacoCommunity></BePartTacoCommunity>
    </Flex>
  )
}

export function HomeStart() {
  console.log(columnTemplate)
  return <Box flexDirection="column" position="relative" overflow="hidden">
    <Grid templateColumns={columnTemplate}>
      <Box flexDir="row" gridColumn="2 / 2" width="30%" fontSize="x-large" fontWeight="bold"><span>Do you want to buy unique pieces of Tacoart? </span><span style={{ color: "grey" }}>(Staking Taco)</span></Box>
      <SliderInfo></SliderInfo>
    </Grid>
    <Blob color="blue" size={100} right="20px" bottom="0"></Blob>
    <Blob color="yellow" size={150} right="20px" top="-10px"></Blob>
    <Blob color="red" size={250} right="-150px" top="60px"></Blob>

  </Box>
}

export function SliderInfo() {


  return (<Center gridColumn="2 / 2" marginBottom="20px">
    <Carousel itemsToShow={1} isRTL={false} showArrows={false}>
      <SliderPage>
        <SliderItem title="1. Buy $TACO" image="/img/slider/buy_taco.svg"></SliderItem>
        <SliderItem title="2. Stake Tacos and obtain Lemons" image="/img/slider/stake_tacos.svg" subtitle="Staking 1 $TACO token in the pool earns you roughly 1 lemon per day"></SliderItem>
        <SliderItem title="3. Buy Tacoart using your Lemons" image="/img/slider/buy_tacoart.svg"></SliderItem>
      </SliderPage>

      <SliderPage>
        <SliderItem title="1. Buy $TACO" image="/img/slider/buy_taco.svg"></SliderItem>
        <SliderItem title="2. Make salsa" image="/img/slider/make_salsa.svg"></SliderItem>
        <SliderItem title="3. Stake Salsa and obtain Chiles" image="/img/slider/stake_salsa.svg" subtitle="Staking 1 $Salsa token in the pool earns you roughly 1 chile per day"></SliderItem>
        <SliderItem title="4. Buy Tacoart using your Chiles" image="/img/slider/buy_tacoart.svg"></SliderItem>
      </SliderPage>

      <SliderPage>
        <SliderItem title="1. Create Tacoart" image="/img/slider/create_tacoart.svg"></SliderItem>
        <SliderItem title="2. Post your art" image="/img/slider/post_your_art.svg"></SliderItem>
        <SliderItem title="3. Claim your ernings" image="/img/slider/claim_your_ernings.svg"></SliderItem>
      </SliderPage>


    </Carousel>
  </Center>)
}
export function SliderPage(props: { children }) {
  return (<Flex flexDir="row">
    {props.children}
  </Flex>)
}

export function SliderItem(props: { title, image, subtitle?}) {
  return (<Flex alignItems="center" flexDir="column" padding="30px" maxW="350px" userSelect="none" textAlign="center">
    <Box fontWeight="semibold" fontSize="x-large">{props.title}</Box>
    <Image src={props.image} layout="intrinsic" draggable="false" width={200} height={200}></Image>
    {props.subtitle && <Box fontSize="medium" color="gray">{props.subtitle}</Box>}
  </Flex>)
}


export function AboutNFTS() {
  let size = [100, 400];
  return (
    <Flex backgroundColor="figma.lightblue" width="100%" alignItems="center" justifyContent="space-around">

      <Flex flexDirection="column" padding={[10, 50]} maxW={[200, 600]}>
        <Box fontWeight="bold" padding={3} paddingLeft={0} fontSize="larger">About NFTs</Box>
        <Box fontSize="large">Non-fungible tokens (NFT) are digital assets that represent a wide range of unique tangible and intangible items, from collectible sports cards to virtual real estate and even digital sneakers.</Box>
        <Box>Read more</Box>
      </Flex>
      <Center height={size} justifyContent="center" width={size}>

        <Image src="/img/taco-celular.svg" layout="fixed" width={300} height={300}></Image>
      </Center>
    </Flex>)
}

export function BePartTacoCommunity() {
  return (<Box position="relative" overflow="hidden">
    <Blob color="blue" size={250} right="20px"></Blob>
    <Blob color="yellow" size={250} right="40%" bottom="-60px"></Blob>
    <Blob color="red" size={250} left="45px" top="60px"></Blob>
    <Flex width="100%" flexDirection="column" alignItems="center" padding={130} fontWeight="bold">
      <Box zIndex="1000" fontSize="large" width="40%" textAlign="center">Be part of the artists that contribute to the Taconomics community</Box>
      <SellYourArtButton></SellYourArtButton>
    </Flex>

  </Box>)
}
export function Blob(props) {
  const { color, size = 100, right, left, top, bottom } = props;
  // let size =props.size || 30;
  return (<Flex position="absolute" height={size} width={size} right={right} top={top} left={left} bottom={bottom}  >
    <Image draggable={false} src={"/img/blob " + color + ".svg"} layout="fill"></Image>
  </Flex>
  )
}
export function SellYourArtButton() {
  return (<Button colorScheme="figma.orange" margin={10}>Sell your art</Button>)
}

