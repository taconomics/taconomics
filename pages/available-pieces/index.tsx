import { Box, Button, Center, Flex, HStack, IconButton, Input, InputGroup, InputLeftAddon, InputRightAddon, InputRightElement, Select, Spinner, Stack, useEventListener } from "@chakra-ui/react";
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
import { VscSearchStop } from 'react-icons/vsc'
import { useEffect } from "react";
import { BiCool } from 'react-icons/bi'

export default function AvailablePieces(props: TacoProps) {
    const [config, setConfig] = useState<SearchConfig>({ tacoProps: props, nextCount: 0, minimumNfts: 7 });
    const pieces = useGetPieces(config)

    props.changeTitle("Available pieces")

    useEventListener("scroll", () => {
        if (window.document.body.offsetHeight == window.pageYOffset + window.innerHeight) {
            addOne();
        }

    })
    useEffect(() => {
        addOne();
    }, [props.changer])

    const addOne = () => {
        setConfig({ ...config, nextCount: config.nextCount + 1 });
    }


    const cards = pieces.nfts.map(val => {
        return (<Card nft={val.nft} key={val.nft.erc1155+"/"+val.nft.id} tacoProps={props}></Card>)
    })
    return (<GridContent marginBottom={10}>
        <Flex flexDir={["column","column","row"]} alignItems={["start","start","center"]} w="100%">
            <Box fontSize="xl" fontWeight="bold" marginRight={20}>Available pieces</Box>
            <SearchPieces config={config} setConfig={setConfig} tacoProps={props} results={undefined}></SearchPieces>
        </Flex>
       
        <SearchLabels config={config} setConfig={setConfig} tacoProps={props} results={pieces.results}></SearchLabels>
        <MessageQueryLoading queryLoaded={pieces.queryLoaded}></MessageQueryLoading>
        <HStack flexWrap="wrap" justifyContent="center">

            {cards.length > 0 ? cards : pieces.loaded && <Center fontSize="xx-large" color="gray.500" fontWeight="bold"><VscSearchStop></VscSearchStop>Could't find anything...</Center>}
        </HStack>
        <MessageLoadingMore addOne={addOne} loaded={pieces.loaded} />
    </GridContent>)
}

function SearchPieces(props: ISearchLabel) {
    const [search, setSearch] = useState<string>(undefined);
    return (<Box>
        <InputGroup size="lg" backgroundColor="white">
            <Input placeholder="Search..." onChange={(e) => {
                console.log("Search by name", e.target.value)
                let search = e.target.value != "" ? e.target.value : undefined
                setSearch(search);
            }} />
            <InputRightElement children={<IconButton colorScheme="figma.orange" aria-label="Search available pieces" icon={<BsSearch />}
                onClick={() => {
                    props.setConfig({ ...props.config, name: search })
                }}
            ></IconButton>} />
        </InputGroup>
    </Box>)
}

function MessageLoadingMore(props: { loaded: boolean,addOne }) {
    return (<Center color="figma.orange.500" fontSize="xx-large">
        {!props.loaded ?
            <>
                <Spinner marginRight={1}></Spinner><Box marginRight={1}>Loading the $juice </Box><BiCool></BiCool>...
            </>
            :
            <Button colorScheme="figma.orange" onClick={props.addOne}>Load more</Button>
        }


    </Center>)
}
function MessageQueryLoading(props:{queryLoaded:boolean}){
    return (<>
            {!props.queryLoaded&&<Center marginBottom={3} color="gray.500"><Spinner></Spinner><Box marginLeft={1} fontSize="x-large">Searching, please be patient...</Box></Center>}
        </>)
}

interface ISearchLabel {
    results: SearchResult, tacoProps: TacoProps, config, setConfig
}

function SearchLabels(props: ISearchLabel) {
    return (<Flex flexDir={["column","column","row"]} marginY={5}>
        <SelectArtists {...props}></SelectArtists>
        <SelectCollections {...props}></SelectCollections>
        <SelectRarity {...props} />
        <SelectInput results={props.results.price} placeholder="Price"></SelectInput>
    </Flex>)
}

interface ISelectInput {
    placeholder,
    results: any[],
    creator?: (val) => any,
    onChange?: (val) => any
}

function SelectInput(props: ISelectInput) {
    return (<Select padding={2} placeholder={props.placeholder} textTransform="capitalize" backgroundColor="white" onChange={props.onChange}>
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

           // const artist = useArtistInfo(props.tacoProps, val);
            return (<Box border="1px" as="option" id={val}>{val}</Box>)
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


            return (<Box border="1px" as="option" id={val.nft.erc1155}>{val.meta.name}</Box>)
        }}></SelectInput>)
}

function SelectRarity(props: ISearchLabel) {
    return (<SelectInput results={props.results.rarity} placeholder="Rarity"
        onChange={(val) => {
            const index = val.target.selectedIndex;
            const rarity = val.target.options[index].value;
            props.setConfig({ ...props.config, rarity: rarity })
        }}
        creator={(val) => {


            return (<Box border="1px" as="option" id={CardTypes[val.toLowerCase()]}>{val}</Box>)
        }}></SelectInput>)
}