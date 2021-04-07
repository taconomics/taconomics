import { Avatar, Box, Center, ExpandedIndex, Flex, Grid, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../src/components/Card/Card";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { columnTemplate } from "../../src/components/TacoLayout";

export default function Collection(props: { unifty: Unifty }) {
    const router = useRouter();
    const [nfts, setNfts] = useState([]);
    const [erc1155Meta, setErc1155Meta] = useState({ name: "Loading...", description: "Loading..." });
    const collection = router.query.collection as string;

    useEffect(() => {
        const func = async () => {
            if (collection != undefined) {
                let nfts = await props.unifty.getNftsByUri(collection);
                let col = [];
                for (const nft of nfts) {
                    const name = Math.floor(Math.random() * 100);
                    let json = await props.unifty.getNftJson(collection, nft)
                    col.push(<Card key={name} nft={json}></Card>);
                }
                setNfts(col);
            }
            let erc1155Meta = await props.unifty.getErc1155Meta(collection);

            fetch(erc1155Meta.contractURI).then(r => r.json()).then(e => {
                console.log(e);
                setErc1155Meta(e);
            })


        }
        func();
    }, [collection])
    return (<Grid templateColumns={columnTemplate}>
        <Box gridColumn="2/2">
            <ArtistInfo unifty={props.unifty} info={erc1155Meta}></ArtistInfo>
            <CollectionCardInfo info={erc1155Meta}></CollectionCardInfo>
            <Flex flexWrap="wrap">{nfts}</Flex>
        </Box>

    </Grid>)
}


export function ArtistInfo(props: { unifty: Unifty, info: any }) {
    console.log(props.info)
    return (<Flex>
        <ArtistBadge info={props.info}></ArtistBadge>
        <Box maxWidth={["60%", "50%"]} paddingLeft={["100px"]} >
            <Box fontSize="x-large" padding="20px" paddingLeft="0px" fontWeight="bold">Artist name</Box>
            <Box fontSize="small">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nibh a faucibus porttitor odio at enim vitae, amet dignissim. Pellentesque nec pellentesque lectus id nulla quisque. Vitae amet, aliquam duis ornare vehicula suspendisse. Vulputate pellentesque pulvinar non tellus.</Box>
        </Box>

    </Flex>)
}
function ArtistBadge(props: { info }) {
    const size = ["200px"]
    return (<Box width={size} height={size} borderRadius="full" overflow="hidden"><Image src="https://bit.ly/dan-abramov" layout="responsive" width="100%" height="100%"></Image></Box>)
}

function CollectionCardInfo(props: { info }) {
    const imgSizeX = ["200px"]
    const imgSizeY = ["150px"]
    return (
        <Flex backgroundColor="white" overflow="hidden" flexDirection="row" justifyContent="center" marginTop="30px" padding={"20px"} boxShadow="base" borderRadius="sm">
            <Flex flexDirection="column" paddingRight="30px">
                <Box color="orange" fontSize="x-small">Featured collection</Box>

                <Box fontWeight="bold" padding="15px" paddingLeft="0px" fontSize="xl">{props.info.name}</Box>
                <Box fontSize="sm">{props.info.description}</Box>
            </Flex>
                <Center>
                    <Box backgroundImage={"url("+props.info.image+")"} backgroundPosition="center" backgroundSize={imgSizeX} borderRadius="lg" width={imgSizeX} height={imgSizeY}></Box>
                </Center>

        </Flex>)
}