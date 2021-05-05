import { Box, Flex, VStack, Image, Button, LinkBox } from "@chakra-ui/react";
import React, { useState } from "react";
import GridContent from "../src/components/GridContent";
import { HiPlus, HiMinus } from 'react-icons/hi'
import NextLink from 'next/link'
import { TacoProps } from "../src/components/TacoLayout";

export default function About(props:TacoProps) {
    props.changeTitle("About us")
    return (<GridContent>
        <WhatIsTaconomics></WhatIsTaconomics>
        <WhatsSpecial></WhatsSpecial>
        <FAQ></FAQ>
        <SmartContracts></SmartContracts>
    </GridContent>)
}

function WhatIsTaconomics() {
    return (<Flex alignItems="center" justifyContent="center" flexDir={["column", "column", "row"]}>
        <Image src="/img/space taco.svg" h={["lg", "sm", "sm"]}></Image>
        <VStack justifyContent="center" alignItems="center">
            <Box fontSize="x-large" fontWeight="bold">What is Taconomics?</Box>
            <Box>
                <Box paddingY={5}>Taconomics is a dapp that seeks to create a launchpad so that Latino artists can make themselves known through their art. </Box>
                <Box>We seek to be a "fair" art gallery in the sense that both artists and the platform can grow together, the artists making their
                    works known and the platform establishing itself in the Ethereum ecosystem.</Box>
            </Box>
        </VStack>
    </Flex>)
}

function WhatsSpecial() {
    return (<Flex direction="column" justifyContent="center" alignItems="center">
        <Box fontSize="x-large" fontWeight="bold" textAlign="center" marginY={5}>What makes $TACO so special?</Box>
        <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
            <SpecialIcon image="/icons/Wale_Icon.svg" title="Fair" description="No pre-sale discount, no whales." color="#00AEE0"></SpecialIcon>
            <SpecialIcon image="/icons/Palm_Icon.svg" title="Fixed" description="No new $TACO can be minted." color="#FF6C63"></SpecialIcon>
            <SpecialIcon image="/icons/Fire_Icon.svg" title="Deflatory" description="$TACO has a deflatory mechanism." color="#F3D158"></SpecialIcon>
            <SpecialIcon image="/icons/Taco_Info_Icon.svg" title="Taco inspired" description="Artist's inspired by TACO will be dropping art to the farm." color="#F3D158"></SpecialIcon>
            <SpecialIcon image="/icons/Check_Icon.svg" title="Verifable" description="Smart contracts can be audited." color="#00AEE0"></SpecialIcon>
            <SpecialIcon image="/icons/Lock_Icon.svg" title="Locked" description="Liquidity is locked in the $TACO Uniswap pool." color="#FF6C63"></SpecialIcon>
        </Flex>
    </Flex>)
}
function SpecialIcon({ image, title, description, color }) {
    return (<Flex flexDir="column" alignItems="center" justifyContent="center" textAlign="center" marginY={5} width="30%">
        <Box backgroundColor={color + "20"} padding={2} borderRadius="full"><Image src={image}></Image></Box>
        <Box fontWeight="bold">{title}</Box>
        <Box fontSize="sm">{description}</Box>

    </Flex>)
}

function FAQ() {
    return (<Flex w="100%" flexDir="column">
        <Box fontSize="x-large" fontWeight="bold">Frequently Asked Questions</Box>
        <FAQuestion title={"What is $TACO"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"What's the point of the game"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"How do I play?"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"How can i trust you?"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"Who audited the Taco smart contract?"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"Is the token on Etherscan yet?"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
        <FAQuestion title={"Who’s behind the proyect?"} description="TACO is this summer’s tastiest defi token. It’s a social experiment, crypto game, and meme machine rolled into one. It’s the future of fair distribution and the most fun you can have with ERC20s, and NFT Farming."></FAQuestion>
    </Flex>)
}
function FAQuestion({ title, description }) {
    const [open, setOpen] = useState(false);
    const iconsSize = "30px"
    const click = () => {
        setOpen(!open);
    }
    return (<Flex borderBottom="1px solid gray" cursor="pointer" w="100%" marginY={5} flexDir="column" onClick={click}>
        <Flex alignItems="center" justifyContent="space-between" w="100%">
            <Box fontWeight="bold" color="gray.600">{title}</Box>
            <Button borderRadius="full" onClick={click} colorScheme={!open ? "white" : "figma.orange"}>{!open ? <HiPlus color="gray" size={iconsSize} /> : <HiMinus size={iconsSize} />}</Button>
        </Flex>
        <Flex overflow="hidden" maxHeight={open ? "150px" : "0"} transition="max-height 1s" w="70%" fontSize="sm" color="gray.500"><Box marginY={2}>{description}</Box></Flex>
    </Flex>)
}

function SmartContracts() {
    return (<Flex flexDir="column" marginY={5} marginBottom={20}>
        <Flex flexDir="column" alignItems="center" marginBottom={2}>
            <Box fontSize="x-large" fontWeight="bold">Smart contracts</Box>
            <Box color="gray.600">Our smart contracts are Open Source and Auditable.</Box>
        </Flex>
        <Contract name="TacoToken" dir="0x00D1793D7C3aAE506257Ba985b34C76AaF642557"></Contract>
        <Contract name="Salsa" dir="0x82e5aec4e37b37fca34925c13429506209a98536"></Contract>
        <Contract name="Tacoshi's Quest" dir="0xD5Dfb159788856f9fd5F897509d5a68b7b571Ea8"></Contract>
        <Contract name="Tacoshi's Rabbit Hole" dir="0xA6fBbE582D41c6ebbb4ad5803793dcce8662C910"></Contract>
        <Contract name="Tacoshi's Farm" dir="0xe567c8eE1C362C6CfCb217e43aCfd0F68dC456F2"></Contract>

    </Flex>)
}
function Contract({ name, dir }) {
    return (<NextLink href={"https://etherscan.io/address/" + dir} passHref>
        <LinkBox cursor="pointer"><Flex marginY={5} flexDir={["column", "column", "row"]} color="gray.600">
        <Box fontWeight="bold" marginRight={1}>{name}</Box>
        <Box fontSize={"sm"}>{dir}</Box>
    </Flex>
    </LinkBox>
    </NextLink>)
}