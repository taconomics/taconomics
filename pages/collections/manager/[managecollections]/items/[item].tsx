import { Box, Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, propNames, Spinner, Stack, Textarea, useToast, VStack } from "@chakra-ui/react";
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
    const [meta, setMeta] = useState(isNew?{name:"",description:"",image:""}:undefined);
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

    }, [setErc, collection, item,setMeta,isNew])
    return (<GridContent marginBottom={5} >
        <Box fontSize="xl" fontWeight="bold">{isNew ? "New Item" : "Edit Item"}</Box>
        {meta!=undefined?<Formik initialValues={{ name: meta.name, rarity: "", lemons: 1, eth: 10, instant: 10, url: "", description: meta.description }} onSubmit={(values, actions) => {
            console.log(erc)
            onSubmit(values, actions, props.unifty, erc, toast,meta,isNew,item);
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
                                <DisplayImage setMeta={setMeta} meta={meta} unifty={unifty}></DisplayImage>
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

        </Formik>:
        <Spinner></Spinner>}
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
function DisplayImage({unifty,meta,setMeta}) {
    console.log(meta)
   const setImage =(image)=>{
       setMeta({...meta,image:image});
       
   }

    return (<Box><UploadImage setImage={setImage} image={meta.image} unifty={unifty}></UploadImage></Box>)
}
async function onSubmit(values, actions, unifty: Unifty, erc, toast,meta,isNew,item) {
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    let nftInfo = {
        name : values.name,
        description : values.description,
        image : meta.image,
        external_link : meta.url,
        attributes: meta.attributes
    };
    toast({
        title: "Uploading data to IPFS",
        description: "Please wait...",
        status: "info",
        duration: toastTime/2,
        position: toastPosition,
        isClosable: true,
    })
    let ipfs = await unifty.ipfs.add(JSON.stringify(nftInfo));
    toast({
        title: "Uploading data to IPFS",
        description: "Done",
        status: "success",
        duration: toastTime/2,
        position: toastPosition,
        isClosable: true,
    })

    let jsonUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path
    console.log("Jsonurl",jsonUrl)
    if(isNew){
        newNft(unifty,toast,jsonUrl,erc,actions);
    }else{
        updateNft(unifty,toast,jsonUrl,erc,item,actions);
    }
    

}

function newNft(unifty,toast,jsonUrl,erc,actions){
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    const nft = unifty.newNft(100, 1000, jsonUrl, erc.erc1155, (e) => {
        console.log("precall", e)
        toast({
            title: "Creating new NFT",
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
                description: "New NFT has been created.",
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


function updateNft(unifty:Unifty,toast,jsonUrl,erc,item,actions){
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    const nft = unifty.updateUri(item,jsonUrl,erc.erc1155, (e) => {
        console.log("precall", e)
        toast({
            title: "Updating NFT",
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
                description: "NFT has been updated.",
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