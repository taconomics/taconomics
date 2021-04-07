import { Box, ExpandedIndex, Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Card from "../../src/components/Card/Card";
import Unifty from "../../src/uniftyLib/UniftyLib";

export default function Collection(props: { unifty: Unifty }) {
    const router = useRouter();
    const [nfts, setNfts] = useState(undefined);
    const [erc1155Meta, setErc1155Meta] = useState(undefined);
    const collection = router.query.collection as string;

    useEffect(() => {
        const func = async () => {
            if (collection != undefined) {
                let nfts = await props.unifty.getNftsByUri(collection);
                let col = [];
                for(const nft of nfts){
                    const name = Math.floor(Math.random() * 100);
                    let json =await props.unifty.getNftJson(collection,nft)
                    col.push(<Card key={name} nft={json}></Card>);
                }
                setNfts(col);
            }
            let erc1155Meta = await props.unifty.getErc1155Meta(collection);
            console.log("Erc1155 meta",erc1155Meta);
            setErc1155Meta(erc1155Meta);

        }
        func();
    }, [collection])

    console.log("Nfts", nfts);
    return (<Box>Collection {erc1155Meta!=undefined&&erc1155Meta.name}
    <Flex flexWrap="wrap">{nfts}</Flex>
    </Box>)
}
