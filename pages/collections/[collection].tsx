import { Avatar, Box, Center, ExpandedIndex, Flex, Grid, HStack, Image, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../src/components/Card/Card";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { columnTemplate, TacoProps } from "../../src/components/TacoLayout";
import { createFakeCards } from "../farms";
import { BePartTacoCommunity } from "..";

import * as Box3 from '3box';

export default function Collection(props: TacoProps) {
    const router = useRouter();
    const [nfts, setNfts] = useState([]);
    const [owner, setOwner] = useState(undefined);
    const [erc1155Meta, setErc1155Meta] = useState({ name: <Center><Spinner /></Center>, description: <Center><Spinner /></Center> });
    const collection = router.query.collection as string;

    useEffect(() => {
        async function func() {
            if (collection != undefined) {
                let col = await getCollectionCards(props, collection, false);
                setNfts(col);
            }
            let erc1155Meta = await props.unifty.getErc1155Meta(collection);

            let owner = await props.unifty.getErc1155Owner(collection);
            console.log("Owner", owner)
            setOwner(owner);

            fetch(erc1155Meta.contractURI).then(r => r.json()).catch(e => { console.error(e) }).then(e => {
                console.log(e);
                setErc1155Meta(e);
            }).catch(e => {
                console.error("error", e);
            })


        }
        func();
    }, [collection])
    return (<><Grid templateColumns={columnTemplate}>
        <Box gridColumn="2/2">
            <ArtistInfo owner={owner} changer={props.changer} unifty={props.unifty} info={erc1155Meta}></ArtistInfo>
            <CollectionCardInfo info={erc1155Meta}></CollectionCardInfo>
            <HStack flexWrap="wrap">{nfts}</HStack>
        </Box>
    </Grid>
        <BePartTacoCommunity></BePartTacoCommunity>
    </>)
}

export async function getCollectionCards(tacoProps: TacoProps, collection: string, canEdit: boolean) {
    //await tacoProps.unifty.sleep(1000)
    //await tacoProps.unifty.isConnected();
    let nfts = await tacoProps.unifty.getNftsByUri(collection);
    let col = [];
    console.log("getCollectionCards", nfts)
    for (const nft in nfts) {

        const name = Math.floor(Math.random() * 100);
        let json = { erc1155: collection, id: nfts[nft] };

        // console.log("Collection card",json)
        col.push(<Card tacoProps={tacoProps} canEdit={canEdit} key={name} nft={json}></Card>);
    }
    return col;
}


export function ArtistInfo(props: { unifty: Unifty, info: any, changer: number, owner }) {
    console.log("Info", props.info)
    const [box3Profile, setProfile] = useState({ name: undefined, description: undefined })
    useEffect(() => {
        async function artistInfoFunc() {
            const profile = await Box3.getProfile(props.owner)
            console.log("Box3 profile", profile);
            setProfile(profile);
        }

        artistInfoFunc();

    }, [props.changer, props.owner])
    return (<Flex>
        <ArtistBadge info={box3Profile}></ArtistBadge>
        <Box maxWidth={["60%", "50%"]} paddingLeft={["100px"]} >
            <Box fontSize="x-large" padding="20px" paddingLeft="0px" fontWeight="bold">{box3Profile.name ? box3Profile.name : props.owner}</Box>
            <Box fontSize="small">{box3Profile.description ? box3Profile.description : "No description to show."}</Box>
        </Box>

    </Flex>)
}
function ArtistBadge(props: { info }) {
    let img = "/img/slider/create_tacoart.svg";
    if (props.info) {

        if (props.info.image) {
            console.log("img ", props.info.image[0].contentUrl["/"])
            img = "https://gateway.ipfs.io/ipfs/"+props.info.image[0].contentUrl["/"]
        }

    }

    const size = ["200px"]
    return (<Box width={size} height={size} borderRadius="full" overflow="hidden"><Image src={img} layout="responsive" width="100%" height="100%"></Image></Box>)
}

function CollectionCardInfo(props: { info }) {
    const imgSizeX = ["200px"]
    const imgSizeY = ["150px"]
    console.log(props.info)
    if (props.info != undefined) {
        return (
            <Flex backgroundColor="white" overflow="hidden" flexDirection="row" justifyContent="space-between" marginBottom={5} marginTop="30px" padding={"20px"} boxShadow="figma" borderRadius="sm">
                <Flex flexDirection="column" paddingRight="30px">
                    <Box color="orange" fontSize="x-small">Featured collection</Box>

                    <Box fontWeight="bold" padding="15px" paddingLeft="0px" fontSize="xl">{props.info.name}</Box>
                    <Box fontSize="sm">{props.info.description}</Box>
                </Flex>
                <Center>
                    <Box backgroundImage={"url(" + props.info.image + ")"} backgroundPosition="center" backgroundSize={"auto 100%"} borderRadius="lg" width={imgSizeX} height={imgSizeY}></Box>
                </Center>

            </Flex>)
    } else {
        return (<Spinner></Spinner>)
    }

}