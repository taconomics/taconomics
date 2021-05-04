import { Box, Center, chakra, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

export default function TacoSwitchSX(props:{children,onChange}) {
    const size = 100 / props.children.length;
    const [active, setActive] = useState(0);
    const position = active * size;

    const newChildren = [];
    if(props.children.forEach){
         props.children.forEach((element, index) => {
        newChildren.push(React.cloneElement(element, { setActive, active, index, size,onChange:props.onChange }))
    });
    }else{
        newChildren.push(React.cloneElement(props.children, { setActive, active, index:0, size,onChange:props.onChange }))
    }
   

    return (<Flex {...props} flexDir="row" width="100%" justifyContent="center" alignItems="center" position="relative" overflow="hidden" backgroundColor="blackAlpha.200" zIndex="0" borderRadius="lg">

        <Box backgroundColor="figma.orange.400" transition="left 1s" zIndex="-1" width={size + "%"} height={"100%"} left={position + "%"} position="absolute"></Box>
        {newChildren}
    </Flex>)
}

export const TacoSwitch = chakra(TacoSwitchSX);

function TacoOptionSX(props) {
    const color = props.index == props.active ? "figma.orange.500" : "black";
    if(props.index==props.active && props.onChange !=undefined){
        props.onChange(props.active,props.name);
    }
    return (<Center padding={"10px"} overflow="hidden" textAlign="center" width={props.size + "%"} maxWidth={props.size + "%"}  transition="color 1s" cursor="pointer" fontWeight="bold" color={color} onClick={() => {
        props.setActive(props.index);
    }}>{props.children}</Center>)
}

export const TacoOption = chakra(TacoOptionSX);