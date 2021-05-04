import { Box, Button, Center, HStack, VStack } from "@chakra-ui/react";
import router from "next/router";
import React from "react";
import {FaRegSadTear} from "react-icons/fa"

export function NoNfts(props:{customText?:string}){
    return <Center w="100%" marginBottom={10}><VStack>
        <HStack><FaRegSadTear></FaRegSadTear><TextMessage>{props.customText?props.customText:"There are no pieces in here."}</TextMessage></HStack>
        <Button colorScheme="figma.orange" onClick={()=>{
            router.push("/available-pieces")
        }}>See available pieces</Button>
    </VStack></Center>
}

export function NoCollections(props:{customText?:string}){
    return <VStack>
        <HStack><FaRegSadTear></FaRegSadTear><TextMessage>{props.customText?props.customText:"There are no collections in here"}</TextMessage></HStack>
        <Button colorScheme="figma.orange" onClick={()=>{
            router.push("/collections")
        }}>See all collections</Button>
    </VStack>
}
function TextMessage({children}){
    return <Box fontSize="xl" color="gray.600" fontWeight="bold">{children}</Box>
}