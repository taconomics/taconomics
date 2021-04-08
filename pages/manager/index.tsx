import { Box, Button, Center, Flex, Grid, Spinner } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { columnTemplate } from "../../src/components/TacoLayout";
import Unifty from "../../src/uniftyLib/UniftyLib";

export default function Manager(props: { unifty: Unifty }) {
    const [myCol, setCol] = useState([]);
    const unifty = props.unifty;
    if (unifty != undefined) {
        useEffect(() => {
            async function func() {


                let connected = await props.unifty.isConnected();
                let length = await props.unifty.getMyErc1155Length();
                let myCollections = [];

                for (let a = 0; a < length; a++) {
                    let erc = await props.unifty.getMyErc1155(a);
                    myCollections.push(<CollectionCard erc={erc} unifty={props.unifty}></CollectionCard>)
                }
                //let myCollections = await props.unifty.getMyErc1155(1);*/
                console.log("En manager", myCollections)
                setCol(myCollections);
            }

            func()
        }, [])
    }

    return (<Grid templateColumns={columnTemplate}>
        <Box gridColumn="2/2">
            <Box fontSize="x-large" fontWeight="bold">Collection manager</Box>
            <Flex flexDir="column">{myCol.length > 0 ? myCol : <Center padding={5}><Spinner></Spinner></Center>}</Flex>
        </Box>

    </Grid>)
}

function CollectionCard(props: { erc: any, unifty: Unifty }) {
    const [meta, setMeta] = useState({description:<Spinner></Spinner>});

    useEffect(() => {
        async function func() {

            let meta = await props.unifty.getErc1155Meta(props.erc.erc1155);
            let realmeta = await props.unifty.readUri(meta.contractURI);
            console.log(realmeta);
            setMeta(realmeta);
        }
        func();
    }, [])
    return (<Box backgroundColor="white" borderRadius="lg" margin={5} boxShadow="lg" padding={5}>
        <Box color="figma.orange.500" fontWeight="bold" fontSize={"x-small"}>My collection</Box>
        <Flex>
            <Box fontSize="x-large" fontWeight="bold" padding={2}>{props.erc.name}</Box>
            <Button marginLeft={5}>Edit collection</Button>
        </Flex>
        <Box>
            {meta.description}
        </Box>
    </Box>)
}