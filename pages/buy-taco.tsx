import { Box, Button, Center, chakra, Flex, Menu, MenuButton, MenuItem, MenuList, Select, VStack } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import TacoSwitch, { TacoOption } from "../src/components/TacoSwitch";
import { FiChevronDown } from 'react-icons/fi'
import { BsArrowDown } from 'react-icons/bs'
import { TacoProps } from "../src/components/TacoLayout";

export default function BuyTacoPage(props: TacoProps) {
    const [buyingTaco, setBuyingTaco] = useState(true);
    props.changeTitle("Buy taco")
    return (<Center flexDir="column">
        {
            <VStack marginBottom={5} spacing={5}>
                <LinkSwap href={"https://matcha.xyz/markets/TACO"} name="Matcha"></LinkSwap>
                <LinkSwap href={"https://app.uniswap.org/#/swap?outputCurrency=0x00d1793d7c3aae506257ba985b34c76aaf642557"} name="Uniswap"></LinkSwap>
                <LinkSwap href={"https://balancer.exchange/#/swap/0x00d1793d7c3aae506257ba985b34c76aaf642557"} name="Balancer"></LinkSwap>
                <LinkSwap href={"https://app.1inch.io/#/1/swap/TACO"} name="1Inch"></LinkSwap>
                <LinkSwap href={"https://app.zerion.io/invest/asset/TACO-0x00d1793d7c3aae506257ba985b34c76aaf642557"} name="Zerion"></LinkSwap>
                <LinkSwap href={"https://www.dharma.io/ "} name="Dharma"></LinkSwap>
            </VStack>
        }


    </Center>)
}

function LinkSwap(props: { href, name }) {
    const goToLink = ()=>{
        window.open(props.href, "_blank");
    }
    const color = "figma.orange.700";
    return (<Box cursor="pointer" border="1px" borderColor={color} _hover={{backgroundColor:"figma.orange.50"}} color={color} padding={5} w={"500px"} textAlign="center" fontWeight="bold" onClick={goToLink}>{props.name}</Box>)
}
