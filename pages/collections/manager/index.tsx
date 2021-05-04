import { Box, Button, Center, Flex, Grid, Spinner, Image } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import Loading from "../../../src/components/Loading";
import { NoCollections, NoNfts } from "../../../src/components/NoData";
import { columnTemplate, TacoProps } from "../../../src/components/TacoLayout";
import Unifty from "../../../src/uniftyLib/UniftyLib";

export default function Manager(props: TacoProps) {
    const [myCol, setCol] = useState([]);
    const unifty = props.unifty;
    const [loaded,setLoaded] = useState(false);
    if (unifty != undefined) {
        useEffect(() => {
            async function func() {

                setCol([])
                setLoaded(false);
                let connected = await props.unifty.isConnected();
                let length = await props.unifty.getMyErc1155Length();
                let myCollections = [];

                for (let a = 0; a < length; a++) {
                    let erc = await props.unifty.getMyErc1155(a);
                    myCollections.push(<CollectionCard id={a} erc={erc} unifty={props.unifty}></CollectionCard>)
                }
                setCol(myCollections);
                setLoaded(true);
            }

            func()
        }, [props.changer])
    }

    return (<Grid templateColumns={columnTemplate} marginBottom={10}>
        <Box gridColumn="2/2">
            <Box fontSize="x-large" fontWeight="bold">Collection manager</Box>
            <Flex flexDir="column">{
            loaded
            ? myCol.length>0?myCol:<NoCollections></NoCollections>: 
            <Loading></Loading>}</Flex>
        </Box>

    </Grid>)
}

function CollectionCard(props: { erc: any, unifty: Unifty, id: number }) {
    const [meta, setMeta] = useState({ description: <Spinner></Spinner>, image: "",name:"" });
    const router = useRouter();

    const goToEdit = () => {
        router.push(router.route + "/" + props.id)
    }

    useEffect(() => {
        async function func() {

            let meta = await props.unifty.getErc1155Meta(props.erc.erc1155);
            let realmeta = await props.unifty.readUri(meta.contractURI);
            setMeta(realmeta);
        }
        func();
    }, [])
    return (<Flex flexDir="row" key={props.id} alignItems="center" justifyContent="space-between" backgroundColor="white" borderRadius="lg" margin={5} boxShadow="figma" padding={5}>
        <Box>
            <Box color="figma.orange.600" fontWeight="bold" fontSize={"x-small"}>My collection</Box>
            <Flex>
                {meta!=undefined&&<Box fontSize="x-large" fontWeight="bold" padding={2}>{meta.name}</Box>}
                <Button variant="outline" colorScheme="figma.orange" marginLeft={5} fontWeight="bold" onClick={goToEdit}>Edit collection</Button>
            </Flex>
            <Box>
                {meta != undefined && meta.description}
            </Box>
        </Box>
        {meta != undefined &&
            <Box minWidth="300px" height="180px" overflow="hidden" marginLeft={5} backgroundImage={"url(" + meta.image + ")"} backgroundPosition="center" backgroundSize="500px" borderRadius="lg">
            </Box>
        }


    </Flex>)
}