import { Box, Button, Flex, FormControl, FormErrorMessage, Image,FormLabel, HStack, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, propNames, Spinner, Stack, Textarea, useToast, VStack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import GridContent from "../../../../../src/components/GridContent";
import InputValidator from "../../../../../src/components/InputValidator";
import UploadImage from "../../../../../src/components/UploadImage";
import { ITrait } from "../../../../../src/hooks/useCardInfo";
import Unifty from "../../../../../src/uniftyLib/UniftyLib";
import { AiFillPlusCircle } from 'react-icons/ai'

export default function ItemManager(props: { unifty: Unifty }) {
    const router = useRouter();
    const item = router.query.item as string;
    const collection = router.query.managecollections as string;
    const isNew = item == "new" ? true : false;
    const [erc, setErc] = useState(undefined);
    const [meta, setMeta] = useState(isNew ? { name: "", description: "", image: "", attributes: [] } : undefined);
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

    }, [setErc, collection, item, setMeta, isNew])
    return (<GridContent marginBottom={5} >
        <Box fontSize="xl" fontWeight="bold">{isNew ? "New Item" : "Edit Item"}</Box>
        {meta != undefined ? <Formik initialValues={{ name: meta.name, rarity: "", lemons: 1, eth: 10, instant: 10, url: "", description: meta.description }} onSubmit={(values, actions) => {
            console.log(erc)
            onSubmit(values, actions, props.unifty, erc, toast, meta, isNew, item);
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
                            <Box flexGrow={3} paddingLeft={20}>
                                <InputValidator name="description" label="Description" placeholder="Item description...">
                                    <Textarea backgroundColor="white" minH="300px"></Textarea>
                                </InputValidator>
                                <AddTraits meta={meta} setMeta={setMeta}></AddTraits>
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

        </Formik> :
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
function DisplayImage({ unifty, meta, setMeta }) {
    console.log(meta)
    const setImage = (image) => {
        setMeta({ ...meta, image: image });

    }

    return (<Box><UploadImage setImage={setImage} image={meta.image} unifty={unifty}></UploadImage></Box>)
}
function AddTraits({ meta, setMeta }) {
    const [att, setAtt] = useState([...meta.attributes]);
    const addTrait = () => {
        const newAt = [...att];
        const newAtt: ITrait = { trait_type: "", value: "" };
        newAt.push(newAtt)
        setAtt(newAt);
    }
    const updateTrait = (index, updated: ITrait) => {
        const newAt = [...att];

        newAt[index] = updated;
        setMeta({ ...meta, attributes: newAt })
        setAtt(newAt);
    }
    const deleteTrait = (index) => {
        let newAt = [...att];

        newAt.splice(index, 1);
        setMeta({ ...meta, attributes: newAt })
        setAtt(newAt);
    }
    return (<Flex flexDir="column">
        <Box color="gray.600">Traits</Box>
        <Box>
            <Button paddingLeft={0} onClick={addTrait} variant="ghost" fontWeight="semibold" colorScheme="figma.orange" fontSize="sm">
                <HStack>
                    <AiFillPlusCircle size={15} />
                    <Box fontWeight="bold">Add trait</Box>
                </HStack>
            </Button>
        </Box>
        {att.map((val, index) => {
            return <Trait updateAtt={updateTrait} trait={val} deleteTrait={deleteTrait} index={index}></Trait>
        })}
    </Flex>)
}
function Trait(props: { trait: ITrait, updateAtt, index, deleteTrait }) {
    const [editing, setEditing] = useState(props.trait.trait_type ? false : true);
    const [type, setType] = useState(props.trait.trait_type)
    const [value, setValue] = useState(props.trait.value)
    let trait: ITrait;
    return (<Box>
        {editing ?
            <VStack maxW="400px" border="1px" borderColor="gray.200" borderRadius="md" backgroundColor="white" padding={5}>
                <HStack>
                    <FormControl>
                        <FormLabel>Trait</FormLabel>
                        <Input value={type} onChange={(e) => {
                            setType(e.target.value)
                        }}></Input>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Value</FormLabel>
                        <Input value={value} onChange={(e) => {
                            setValue(e.target.value)
                        }}></Input>
                    </FormControl>

                </HStack>
                <HStack justifyContent="space-between" alignSelf="flex-end">
                    <Button onClick={() => { setEditing(false) }}>Cancel</Button>
                    <Button colorScheme="figma.orange" onClick={() => {
                        trait = { trait_type: type, value: value }
                        props.updateAtt(props.index, trait);
                        setEditing(false);
                    }}>Add</Button>
                </HStack>
            </VStack> :
            <Flex justifyContent="space-between" alignItems="center">
                <Box fontWeight="semibold" color="gray.500">{props.trait.trait_type}: {props.trait.value}</Box>
                <HStack>
                    <Button variant="ghost" borderRadius="full" onClick={() => {
                        setEditing(true);
                    }}><Image src="/icons/Edit_Icon.svg" w="17px"></Image></Button>
                    <Button variant="ghost" borderRadius="full" onClick={() => {
                        props.deleteTrait(props.index);
                    }}><Image src="/icons/Delete_Icon.svg" w="17px"></Image></Button>
                </HStack>
            </Flex>
        }

    </Box>)
}
async function onSubmit(values, actions, unifty: Unifty, erc, toast, meta, isNew, item) {
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    let nftInfo = {
        name: values.name,
        description: values.description,
        image: meta.image,
        external_link: meta.url,
        attributes: meta.attributes
    };
    toast({
        title: "Uploading data to IPFS",
        description: "Please wait...",
        status: "info",
        duration: toastTime / 2,
        position: toastPosition,
        isClosable: true,
    })
    let ipfs = await unifty.ipfs.add(JSON.stringify(nftInfo));
    toast({
        title: "Uploading data to IPFS",
        description: "Done",
        status: "success",
        duration: toastTime / 2,
        position: toastPosition,
        isClosable: true,
    })

    let jsonUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path
    console.log("Jsonurl", jsonUrl)
    if (isNew) {
        newNft(unifty, toast, jsonUrl, erc, actions);
    } else {
        updateNft(unifty, toast, jsonUrl, erc, item, actions);
    }


}

function newNft(unifty, toast, jsonUrl, erc, actions) {
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
                title: "Transaction's finished",
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
                title: "Transaction's finished",
                description: "Something happened...",
                status: "error",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
            actions.resetForm();
        })
}


function updateNft(unifty: Unifty, toast, jsonUrl, erc, item, actions) {
    let toastTime = 20000;
    let toastPosition = "bottom-right"
    const nft = unifty.updateUri(item, jsonUrl, erc.erc1155, (e) => {
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