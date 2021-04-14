import { Box, Center, chakra, Flex } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import TacoSwitch, { TacoOption } from "../src/components/TacoSwitch";

export default function () {
    const [buyingTaco, setBuyingTaco] = useState(true);
    return (<Center >
        <Flex padding={5} backgroundColor="white" shadow="lg" width={["60%","60%","30vw"]} borderRadius="lg" marginBottom={5}>
            <TacoSwitch>
                <TacoOption>Buy TACO</TacoOption>
                <TacoOption>Make Salsa</TacoOption>
            </TacoSwitch>
        </Flex>

    </Center>)
}