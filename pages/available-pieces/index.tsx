import { Box, Center, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import GridContent from "../../src/components/GridContent";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { BsSearch } from 'react-icons/bs'
import { RecentNfts } from "../farms";
import { SearchConfig, SearchResult, useGetPieces } from "../../src/hooks/useGetPieces";
import Card, { CardTypes } from "../../src/components/Card/Card";
import { useArtistInfo } from "../../src/hooks/useArtistInfo";
import { TacoProps } from "../../src/components/TacoLayout";
import { useState } from "react";
import {VscSearchStop} from  'react-icons/vsc'

export default function AvailablePieces(props: TacoProps) {

    console.log("Taco props", props);

    const [config, setConfig] = useState<SearchConfig>({ unifty: props.unifty, pageSize: 4 });
    const pieces = useGetPieces(config, props.changer)

    const cards = pieces.results.nfts.map(val => {
        return (<Card nft={val.nft} tacoProps={props}></Card>)
    })
    return (<GridContent marginBottom={10}>
        <HStack>
            <Box fontSize="xl" fontWeight="bold" marginRight={20}>Available pieces</Box>
            <SearchPieces results={pieces.results}></SearchPieces>
        </HStack>
        <SearchLabels config={config} setConfig={setConfig} tacoProps={props} results={pieces.results}></SearchLabels>
        <HStack flexWrap="wrap">
            {!pieces.loaded && <Spinner></Spinner>}
            {cards.length>0?cards:pieces.loaded&&<Center fontSize="xx-large" color="gray.500" fontWeight="bold"><VscSearchStop></VscSearchStop> Could't find anything...</Center>}
        </HStack>

    </GridContent>)
}

function SearchPieces({ results: SearchResult }) {
    return (<Box>
        <InputGroup size="lg" backgroundColor="white">
            <Input placeholder="Search..." />
            <InputRightElement children={<IconButton colorScheme="figma.orange" aria-label="Search available pieces" icon={<BsSearch />} ></IconButton>} />
        </InputGroup>
    </Box>)
}

interface ISearchLabel {
    results: SearchResult, tacoProps: TacoProps, config, setConfig
}

function SearchLabels(props: ISearchLabel) {
    return (<HStack marginY={5}>
        <SelectArtists {...props}></SelectArtists>
        <SelectCollections {...props}></SelectCollections>
        <SelectRarity {...props}/>
        <SelectInput results={props.results.price} placeholder="Price"></SelectInput>
    </HStack>)
}

interface ISelectInput {
    placeholder,
    results: any[],
    creator?: (val) => any,
    onChange?: (val) => any
}

function SelectInput(props: ISelectInput) {
    return (<Select placeholder={props.placeholder} textTransform="capitalize" backgroundColor="white" onChange={props.onChange}>
        {props.results.map((value) => {
            if (props.creator) {
                return props.creator(value)
            }

        })}
    </Select>)
}

function SelectArtists(props: ISearchLabel) {
    return (<SelectInput results={props.results.artist} placeholder="All artists"
        onChange={(val) => {
            const index = val.target.selectedIndex;
            const artist = val.target.options[index].id;
            props.setConfig({ ...props.config, artist: artist })
        }}
        creator={(val) => {
            console.log("SerchLabels", val);
            const artist = useArtistInfo(props.tacoProps, val);
            return (<Box border="1px" as="option" id={val}>{artist.name}</Box>)
        }}></SelectInput>)
}

function SelectCollections(props: ISearchLabel) {
    return (<SelectInput results={props.results.collections} placeholder="All collections"
        onChange={(val) => {
            const index = val.target.selectedIndex;
            const collection = val.target.options[index].id;
            props.setConfig({ ...props.config, collection: collection })
        }}
        creator={(val) => {
            console.log("SerchLabels collection", val);

            return (<Box border="1px" as="option" id={val.address}>{val.meta.name}</Box>)
        }}></SelectInput>)
}

function SelectRarity(props: ISearchLabel) {
    return (<SelectInput results={props.results.rarity}  placeholder="Rarity"
        onChange={(val) => {
            const index = val.target.selectedIndex;
            const rarity = val.target.options[index].id;
            props.setConfig({ ...props.config, rarity: rarity })
        }}
        creator={(val) => {
            console.log("SerchLabels rarity", val);

            return (<Box border="1px" as="option" id={CardTypes[val.toLowerCase()]}>{val}</Box>)
        }}></SelectInput>)
}