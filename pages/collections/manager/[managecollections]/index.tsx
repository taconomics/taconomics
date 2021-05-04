import { Box, Button, Center, chakra, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, Textarea, useToast, VStack, Image, LinkBox, LinkOverlay } from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { cardHeight, cardWidth, EmptyCard } from "../../../../src/components/Card/Card";
import GridContent from "../../../../src/components/GridContent";
import Unifty from "../../../../src/uniftyLib/UniftyLib";
import { getCollectionCards } from "../../[collection]";
import NextLink from 'next/link'
import UploadImage from "../../../../src/components/UploadImage";
import { TacoProps } from "../../../../src/components/TacoLayout";
import InputValidator from "../../../../src/components/InputValidator";

export default function ManageCollection(props: TacoProps) {
    const router = useRouter();
    const collection = router.query.managecollections as string;
    const toast = useToast();
    const [data, setMeta] = useState({ erc: {}, meta: { name: undefined } });
    const [image, setImage] = useState("");
    const isNew = collection == "new";

    if (isNew) {
        // setMeta({})
    }

    useEffect(() => {

        async function func() {
            let connected = await props.unifty.isConnected();
            if (connected && props.unifty.account != "") {
                let erc = await props.unifty.getMyErc1155(collection)
                let realmeta = await props.unifty.readUri(erc.contractURI);
                if (realmeta != undefined) {
                    setImage(realmeta.image);
                    setMeta({ erc: erc, meta: realmeta });
                }
            }

        }
        if (collection != undefined && !isNew) {
            func();
        }

    }, [collection, props.changer])
    return (<GridContent>
        <Box fontSize="x-large" fontWeight="bold" marginBottom={5}>{isNew?"Create":"Edit"} collection</Box>
        {data.meta != undefined && <Flex>
            <UploadImage unifty={props.unifty} setImage={setImage} image={image}></UploadImage>
            <Box flexGrow={2}>
                {(data.meta.name != undefined || isNew) && <FormEdit isNew={isNew} changer={props.changer} image={image} id={collection} toast={toast} data={data} unifty={props.unifty}></FormEdit>}
            </Box>
        </Flex>}
        <CollectionItems unifty={props.unifty} changer={props.changer} collection={data.erc}></CollectionItems>
    </GridContent>)
}

function CollectionItems(props: { unifty: Unifty, collection: any, changer: number }) {
    const [items, set] = useState([]);
    useEffect(() => {
        async function name() {
            set([])
            let items = []
            if (props.collection.erc1155 != undefined) {
                items = await getCollectionCards({ unifty: props.unifty, changer: props.changer }, props.collection.erc1155, true);
            }
            items.push(<AddItemCard />)
            set(items);

        }
        name();
    }, [props.collection, props.changer])
    return (
        <Box>
            <Box fontSize="xl" fontWeight="bold" marginY={5}>Items</Box>
            <HStack flexWrap="wrap" spacing={5}>{items}</HStack>
        </Box>)
}
function AddItemCard() {
    const router = useRouter();

    return (<EmptyCard key={12345} setHover={undefined}>

        <LinkBox cursor="pointer">
            <NextLink href={router.asPath + "/items/new"} passHref>
                <Center w={cardWidth} h={cardHeight}>
                    <LinkOverlay>

                        <VStack>
                            <Image src="/icons/Add_Icon.svg"></Image>
                            <Box>Add new item</Box>
                        </VStack>
                    </LinkOverlay>

                </Center>
            </NextLink>
        </LinkBox>
    </EmptyCard>)
}


function FormEdit({ toast, unifty, data, id, image, changer, isNew }) {
    data["id"] = id;
    toast = useToast();
    const [up, update] = useState(0);
    useEffect(() => {
        update(up + 1);
        console.log("update", data)
    }, [changer, data])

    return (
        <Formik
            initialValues={{ name: data.meta.name, ticker: data.erc.symbol, description: data.meta.description }}
            onSubmit={(values, actions) => {
                if (!isNew) {
                    onSubmit(values, actions, toast, unifty, data, image);
                } else {
                    onSubmitNew(values, actions, toast, unifty, image);
                }

            }}
        >
            {(props) => {
            
                // props.setValues({...props.values,ticker:props.values.name})
                useEffect(() => {
                    if (props.values.name && isNew) {
                        const words = props.values.name.split(" ");
                        let ticker = "";
                        for (let w of words) {
                            if(w[0])
                            ticker += w[0].toUpperCase();
                        }
                        ticker += "TACOS"
                        props.setFieldValue("ticker", ticker);
                    }

                }, [props.values.name])

                return (
                    <Form>
                        <InputValidator w={"60%"} name="name" label={"Collection name"} placeholder="Collection name"></InputValidator>
                        <InputValidator w={"60%"} name="ticker" label={"Ticker"} placeholder="Ticker">
                            <Input backgroundColor="white" disabled value={props.values.name}></Input>
                        </InputValidator>
                        <InputValidator w={"100%"} name="description" label={"Description"} placeholder="Collection description." >
                            <Textarea backgroundColor="white" minH="300px"></Textarea>
                        </InputValidator>
                        <Button
                            mt={4}
                            colorScheme="figma.orange"
                            isLoading={props.isSubmitting}
                            type="submit"
                        >
                            Save changes
                        </Button>
                    </Form>
                )
            }
            }
        </Formik>
    )
}


async function onSubmitNew(values, actions, toast, unifty, image) {
    let contractInfo = {
        name: values.name,
        description: values.description,
        image: image,
        external_link: ""
    };
    let toastTime = 20000;
    let toastPosition = "bottom-right"

    let u = (unifty as Unifty);
    let ipfs = await u.ipfs.add(JSON.stringify(contractInfo))

    let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path;

    console.log("Creating new collection",ipfsUrl)

    u.newErc1155(contractInfo.name, values.ticker, ipfsUrl, u.defaultProxyRegistryAddress,
        ((e) => {
            console.log("Precall", e)
            toast({
                title: "Transaction started.",
                description: "Please wait while we create your new collection...",
                status: "info",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
        }),
        ((e) => {
            console.log("PostCall", e)
            toast({
                title: "Transaction finished.",
                description: "Thank you! Your transaction has been completed.",
                status: "success",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
        }),
        ((e) => {
            console.log("Error", e);
            toast({
                title: "An error has occurred.",
                description: "CODE: " + e.code + " - Message: " + e.message,
                status: "error",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
        })
    )
    actions.resetForm();
}


async function onSubmit(values, actions, toast, unifty, data, image) {
    console.log("Values", values)
    let contractInfo = {
        name: values.name,
        description: values.description,
        image: image != unifty ? image : "",
        external_link: ""
    };
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    console.log("actions", actions)

    let u = (unifty as Unifty);
    let ipfs = await u.ipfs.add(JSON.stringify(contractInfo))

    let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path;



    u.setContractURI(data.erc.erc1155, ipfsUrl,
        (e) => {
            console.log("precall", e)
            toast({
                title: "Updating collection",
                description: "Please wait...",
                status: "info",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
        },
        e => {
            console.log("postcall", e);
            toast({
                title: "Transaction finished",
                description: "Collection has been updated successfully.",
                status: "success",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
            actions.resetForm();
        },
        e => {
            console.error("error", e)
            toast({
                title: "Transaction finished",
                description: "Something happened...",
                status: "error",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
            actions.resetForm();
        })

}