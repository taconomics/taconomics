import { Box, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import GridContent from "../../src/components/GridContent";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { BsSearch } from 'react-icons/bs'
import { RecentNfts } from "../farms";
import { SearchResult, useGetPieces } from "../../src/hooks/useGetPieces";
import Card from "../../src/components/Card/Card";
import { useArtistInfo } from "../../src/hooks/useArtistInfo";
import { TacoProps } from "../../src/components/TacoLayout";

export default function AvailablePieces(props: TacoProps) {
    const pieces = useGetPieces({ pageSize: 4, unifty: props.unifty }, props.changer)
    return (<GridContent marginBottom={10}>
        <HStack>
            <Box fontSize="xl" fontWeight="bold" marginRight={20}>Available pieces</Box>
            <SearchPieces results={pieces.results}></SearchPieces>
        </HStack>
        <SearchLabels tacoProps={props} results={pieces.results}></SearchLabels>
        <HStack flexWrap="wrap">
            {pieces.results.nfts.map(val => {
                return (<Card nft={val.nft} changer={props.changer} unifty={props.unifty}></Card>)
            })}
        </HStack>

    </GridContent>)
}

function SearchPieces({results:SearchResult}) {
    return (<Box>
        <InputGroup size="lg" backgroundColor="white">
            <Input placeholder="Search..." />
            <InputRightElement children={<IconButton colorScheme="figma.orange" aria-label="Search available pieces" icon={<BsSearch />} ></IconButton>} />
        </InputGroup>
    </Box>)
}

function SearchLabels(props:{results:SearchResult,tacoProps:TacoProps}) {
    return (<HStack marginY={5}>
        <SelectInput results={props.results.artist} placeholder="All artists" creator={(val)=>{
            console.log("SerchLabels",val);
            const artist = useArtistInfo(props.tacoProps,val);
            return (<Box border="1px" as="option">{artist.name}</Box>)
        }}></SelectInput>
        <SelectInput results={props.results.collections} placeholder="All collections"></SelectInput>
        <SelectInput results={props.results.rarity} placeholder="Rarity"></SelectInput>
        <SelectInput results={props.results.price} placeholder="Price"></SelectInput>
    </HStack>)
}

function SelectInput(props:{ placeholder,results:any[],creator?:(val)=>any }) {
    return (<Select placeholder={props.placeholder} backgroundColor="white">
        {props.results.map((value)=>{
            if(props.creator){
               return props.creator(value)
            }
            
        })}
    </Select>)
}