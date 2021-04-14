import { Box, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import GridContent from "../../src/components/GridContent";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { BsSearch } from 'react-icons/bs'

export default function AvailablePieces(props: { unifty: Unifty }) {
    return (<GridContent marginBottom={10}>
        <HStack>
            <Box fontSize="xl" fontWeight="bold" marginRight={20}>Available pieces</Box>
            <SearchPieces></SearchPieces>
        </HStack>
        <SearchLabels></SearchLabels>
    </GridContent>)
}

function SearchPieces() {
    return (<Box>
        <InputGroup size="lg" backgroundColor="white">
            <Input placeholder="Search..." />
            <InputRightElement children={<IconButton colorScheme="figma.orange" aria-label="Search available pieces" icon={<BsSearch />} ></IconButton>} />
        </InputGroup>
    </Box>)
}

function SearchLabels(){
return( <HStack marginTop={5}>
    <SelectInput placeholder="All artists"></SelectInput>
    <SelectInput placeholder="All collections"></SelectInput>
    <SelectInput placeholder="Rarity"></SelectInput>
    <SelectInput placeholder="Price"></SelectInput>
</HStack>)
}

function SelectInput({placeholder}){
    return (<Select placeholder={placeholder} backgroundColor="white">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
  </Select>)
}