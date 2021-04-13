import { Box, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import GridContent from "../../src/components/GridContent";
import Unifty from "../../src/uniftyLib/UniftyLib";
import {BsSearch} from 'react-icons/bs'

export default function AvailablePieces(props:{unifty:Unifty}){
    const router = useRouter();

    console.log(router.query);
    return (<GridContent>
        <HStack>
            <Box fontSize="xl" fontWeight="bold" marginRight={20}>Available pieces</Box>
            <SearchPieces></SearchPieces>
        </HStack>
    </GridContent>)
}

function SearchPieces(){
return (<Box>
    <InputGroup size="lg" backgroundColor="white">
    <Input placeholder="Search..." />
    <InputRightElement children={<IconButton colorScheme="figma.orange"  aria-label="Search available pieces" icon={<BsSearch />} ></IconButton>} />
  </InputGroup>
</Box>)
}
