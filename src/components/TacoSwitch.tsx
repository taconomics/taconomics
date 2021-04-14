import { Box, Center, chakra, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

export default function TacoSwitchSX(props) {
    const size = 100 / props.children.length;
    const [active, setActive] = useState(0);
    console.log(size);
    const position = active * size;

    const newChildren = [];
    props.children.forEach((element, index) => {
        newChildren.push(React.cloneElement(element, { setActive, active, index, size }))
    });

    return (<Flex {...props} flexDir="row" width="100%" justifyContent="center" alignItems="center" position="relative" overflow="hidden" backgroundColor="blackAlpha.200" zIndex="0" borderRadius="lg">

        <Box backgroundColor="figma.orange.400" transition="left 1s" zIndex="-1" width={size + "%"} height={"100%"} left={position + "%"} position="absolute"></Box>
        {newChildren}
    </Flex>)
}

export const TacoSwitch = chakra(TacoSwitchSX);

function TacoOptionSX(props) {
    const color = props.index == props.active ? "figma.orange.500" : "black";
    return (<Center padding={"10px"} overflow="hidden" textAlign="center" width={props.size + "%"} maxWidth={props.size + "%"}  transition="color 1s" cursor="pointer" fontWeight="bold" color={color} onClick={() => {
        props.setActive(props.index);
    }}>{props.children}</Center>)
}

export const TacoOption = chakra(TacoOptionSX);