import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, propNames, Stack, Textarea, useToast, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import GridContent from "../../../../../src/components/GridContent";
import InputValidator from "../../../../../src/components/InputValidator";
import UploadImage from "../../../../../src/components/UploadImage";
import Unifty from "../../../../../src/uniftyLib/UniftyLib";

export default function ItemManager(props: { unifty: Unifty }) {
    const router = useRouter();
    const item = router.query.item as string;
    const collection = router.query.managecollections as string;
    const isNew = item == "new" ? true : false;
    const [erc, setErc] = useState(undefined);
    const [meta, setMeta] = useState(undefined);
    const toast = useToast();
    const unifty = props.unifty;

    useEffect(() => {
        async function func() {
            let connected = await props.unifty.isConnected();
            if (collection) {
                let erc = await props.unifty.getMyErc1155(collection);
                setErc(erc);

                if (!isNew) {
                    let realNft = await props.unifty.getNft(erc.erc1155, item);
                    let metaNft = await props.unifty.getNftMeta(erc.erc1155, item);

                    let jsonMeta = await fetch(metaNft).then(r => r.json()).catch(e => { console.error(e) })

                    setMeta(jsonMeta);
                }
            }

        }

        func()

    }, [setErc, collection, item,setMeta])
    console.log("Dentro", erc);
    return (<GridContent  >
        <Box fontSize="xl" fontWeight="bold">{isNew ? "New Item" : "Edit Item"}</Box>
        <Formik initialValues={{ name: "El NFT", rarity: "ExtraRaro", lemons: 1, eth: 10, instant: 10, url: "drokt.com", description: "Mi nuevo NFT" }} onSubmit={(values, actions) => {
            console.log(erc)
            onSubmit(values, actions, props.unifty, erc, toast);
        }}>
            {
                (props) => (
                    <Form>
                        <HStack alignItems="start" marginBottom={20}>
                            <VStack flexGrow={2} alignItems="start">
                                <InputValidator name="name" placeholder="Item name" label="Item Name"></InputValidator>
                                <InputValidator name="rarity" placeholder="Rarity" label="Rarity"></InputValidator>
                                <InputValidator name="lemons" validate={validateNumber} placeholder="0" label="Price in lemons">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="eth" validate={validateNumber} placeholder={0} label="ETH to mint">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="instant" validate={validateNumber} placeholder={0} label="Price for instant purchase" w="100%">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="url" placeholder="Url" label="Url" ></InputValidator>
                                <DisplayImage meta={meta} unifty={unifty}></DisplayImage>
                            </VStack>
                            <Box flexGrow={3}>
                                <InputValidator name="description" label="Description" placeholder="Item description...">
                                    <Textarea backgroundColor="white" minH="300px"></Textarea>
                                </InputValidator>
                            </Box>
                        </HStack>
                        <Stack direction="row-reverse">
                            <Button colorScheme="figma.orange" isLoading={props.isSubmitting} type="submit">Save changes</Button>
                            <Button variant="outline" onClick={() => {
                                props.resetForm();
                            }} >Cancel</Button>

                        </Stack>
                    </Form>
                )
            }

        </Formik>
    </GridContent>)
}

const DNumberInput = (props) => (
    <Input type="number" backgroundColor="white" {...props}>
    </Input>
)

function validateNumber(value) {
    let error
    if (isNaN(value)) {
        error = "That's not a number"
    } else
        if (!value) {
            error = "Field is required"
        } else
            if (value <= 0) {
                error = "Value should be bigger than 0"
            }
    return error
}
function DisplayImage({unifty,meta}) {
    console.log(meta)
    const [image,setImage] = useState(meta.image?meta.image:undefined);

    return (<Box><UploadImage setImage={setImage} image={image} unifty={unifty}></UploadImage></Box>)
}
async function onSubmit(values, actions, unifty: Unifty, erc, toast) {

    let jsonUrl = ""
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    console.log(erc)
    const nft = unifty.newNft(1, 1000, jsonUrl, erc.erc1155, (e) => {
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