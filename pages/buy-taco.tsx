import { Box, Button, Center, chakra, Flex, Menu, MenuButton, MenuItem, MenuList, Select } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import TacoSwitch, { TacoOption } from "../src/components/TacoSwitch";
import { FiChevronDown } from 'react-icons/fi'
import { BsArrowDown } from 'react-icons/bs'

export default function () {
    const [buyingTaco, setBuyingTaco] = useState(true);
    const onChange = (index, name) => {
        if (name == "taco") {
            setBuyingTaco(true);
        } else {
            setBuyingTaco(false);
        }
    }
    return (<Center flexDir="column">
        <Flex padding={5} backgroundColor="white" shadow="lg" width={["80%", "60%", "30vw"]} borderRadius="lg" marginBottom={5}>
            <TacoSwitch onChange={onChange}>
                <TacoOption name="taco">Buy TACO</TacoOption>
                <TacoOption name="salsa">Make Salsa</TacoOption>
            </TacoSwitch>
        </Flex>
        {buyingTaco?
        <BuyTaco></BuyTaco>
        :
        <MakeSalsa></MakeSalsa>
        }
       

    </Center>)
}

function BuyTaco() {
    return (<Flex padding={5} flexDir="column" backgroundColor="white" shadow="lg" width={["80%", "60%", "30vw"]} borderRadius="lg" marginBottom={5} alignItems="center" justifyContent="center">
        <ValueBox></ValueBox>
        <BsArrowDown/>
        <ValueBox></ValueBox>
        <Button colorScheme="figma.orange" width="70%">Connect wallet</Button>
    </Flex>)
}
function MakeSalsa() {
    return (<Flex padding={5} flexDir="column" backgroundColor="white" shadow="lg" width={["80%", "60%", "30vw"]} borderRadius="lg" marginBottom={5} alignItems="center" justifyContent="center">
        MakeSalsa
    </Flex>)
}
function ValueBox() {
    const [value, setValue] = useState(0.0);
    const [selected,setSelected] = useState("ETH")
    return (<Flex backgroundColor="blackAlpha.200"  flexDir="column" padding={2} marginY={5} borderRadius="lg" width="70%">
        <Box fontSize="x-small" color="blackAlpha.600">From</Box>
        <Flex justifyContent="space-between" alignItems="center">
            <Box fontSize="lg" fontWeight="bold" color="blackAlpha.600">{value}</Box>
            <Menu>
                <MenuButton backgroundColor="white" as={Button} rightIcon={<FiChevronDown />}>
                    {selected}
                </MenuButton>
                <MenuList >
                    <ValueBoxItem setSelected={setSelected}>ETH</ValueBoxItem>
                    <ValueBoxItem setSelected={setSelected}>TACO</ValueBoxItem>
                </MenuList>
            </Menu>
        </Flex>
    </Flex>)
}
function ValueBoxItem({setSelected,children}){
    return (<MenuItem onClick={()=>{
        setSelected(children);
    }}>{children}</MenuItem>)
}