import { Box } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

export default function Collection(props){
    const router = useRouter();
    const collection = router.query.farm as string;
    return (<Box>Collection {collection}</Box>)
}