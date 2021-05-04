import { Box, Center, HStack, Spinner } from "@chakra-ui/react";
import React from "react";

export default function Loading(props:{customText?:string}){
    return <Center><HStack color="gray.700"><Spinner></Spinner><Box fontSize={"xl"} fontWeight="bold">{props.customText?props.customText:"Loading..."}</Box></HStack></Center>
}