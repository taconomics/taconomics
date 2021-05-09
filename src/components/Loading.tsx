import { Box, Center, HStack, Spinner } from "@chakra-ui/react";
import React from "react";

export default function Loading(props:{customText?:any,color?:string}){
    return <Center><HStack color={props.color?props.color:"gray.700"}><Spinner></Spinner><Box fontSize={"xl"} fontWeight="bold">{props.customText?props.customText:"Loading..."}</Box></HStack></Center>
}