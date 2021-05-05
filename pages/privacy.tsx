import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import { TacoProps } from "../src/components/TacoLayout";
import {LoremIpsum } from 'react-lorem-ipsum'

export default function Privacy(props: TacoProps) {
    props.changeTitle("Privacy policy")
    return <VStack>
        <Box fontSize="xx-large" fontWeight="bold">
            Privacy policy
        </Box>
        <VStack w={["100%","60%","60%"]} marginBottom={5}>
        <LoremIpsum p={6} />
        </VStack>
    </VStack>
}