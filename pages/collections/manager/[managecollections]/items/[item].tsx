import { Box, Button, Flex, FormControl, FormErrorMessage, Image, FormLabel, HStack, Input, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, propNames, Spinner, Stack, Textarea, useToast, VStack, Menu, Select, Modal, ModalOverlay, ModalContent, ModalBody, useDisclosure, ModalHeader, ModalFooter } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import GridContent from "../../../../../src/components/GridContent";
import InputValidator from "../../../../../src/components/InputValidator";
import UploadImage from "../../../../../src/components/UploadImage";
import { ICardInfo, IMetaNft, ITrait, useCardInfo } from "../../../../../src/hooks/useCardInfo";
import Unifty from "../../../../../src/uniftyLib/UniftyLib";
import { AiFillPlusCircle } from 'react-icons/ai'
import { CardTypes } from "../../../../../src/components/Card/Card";
import TacoSwitch, { TacoOption } from "../../../../../src/components/TacoSwitch";
import { GiFarmTractor } from 'react-icons/gi'
import { TacoProps } from "../../../../../src/components/TacoLayout";
import { useTrasactionToaster } from "../../../../../src/hooks/useTransactionToaster";

export default function ItemManager(props: TacoProps) {
    const router = useRouter();
    const item = router.query.item as string;
    const collection = router.query.managecollections as string;
    const isNew = item == "new" ? true : false;
    const [erc, setErc] = useState(undefined);
    const [meta, setMeta] = useState<IMetaNft>({ name: "", description: "", image: "", attributes: [] });
    const toast = useToast();
    const unifty = props.unifty;

    props.changeTitle("Item manager")

    const [isWhiteListed, setWhiteListed] = useState(false);

    const ercDir = erc ? erc.erc1155 : "No erc1155";
    const cardInfo = useCardInfo(props, ercDir, isNew ? 0 : Number(item), { useExtras: true, useMeta: true, useFarmData: true })


    useEffect(() => {
        console.log("erc", cardInfo.meta)
        if (!isNew)
            setMeta({ name: cardInfo.meta.name, description: cardInfo.meta.description, image: cardInfo.meta.image, attributes: cardInfo.meta.attributes });
    }, [cardInfo])

    useEffect(() => {
        async function func() {
            let connected = await props.unifty.isConnected();
            if (collection) {
                let erc = await props.unifty.getMyErc1155(collection);
                setErc(erc);
            }
            let balance = await props.unifty.balanceof(cardInfo.erc1155, props.unifty.account, cardInfo.id);
            console.log("Balanceeee", balance)

        }

        func()

    }, [setErc, collection, item, setMeta, isNew])
    const hasFarm = cardInfo.farmAddress != undefined ? true : false
    const tacoProps: TacoProps = props;
    return (<GridContent marginBottom={5} >
        <HStack><Box fontSize="xl" fontWeight="bold">{isNew ? "New Item" : "Edit Item"}</Box>
            <Box>You own: {cardInfo.nft ? cardInfo.nft.balance : 0}</Box>
        </HStack>
        {meta != undefined ? <Formik initialValues={{ name: meta.name, description: meta.description }} onSubmit={(values, actions) => {
            console.log(erc)
            onSubmit(values, actions, props.unifty, erc, toast, meta, isNew, item);
        }}>
            {
                (props) => {
                    useEffect(() => {

                        if (!isNew)
                            props.setValues({ name: cardInfo.meta.name, description: cardInfo.meta.description })
                    }, [cardInfo])
                    return (
                        <Form>
                            <HStack alignItems="start" marginBottom={20}>
                                <VStack flexGrow={2} alignItems="start">
                                    <InputValidator name="name" placeholder="Item name" label="Item Name"></InputValidator>

                                    <InputValidator name="description" label="Description" placeholder="Item description...">
                                        <Textarea backgroundColor="white" minH="300px"></Textarea>
                                    </InputValidator>
                                </VStack>
                                <VStack alignItems="start" flexGrow={1} paddingLeft={20}>
                                    <Box fontWeight="bold">Image</Box>
                                    <DisplayImage setMeta={setMeta} meta={meta} unifty={unifty}></DisplayImage>

                                    <AddTraits meta={meta} setMeta={setMeta}></AddTraits>

                                </VStack>
                            </HStack>
                            <AddToFarm hasFarm={hasFarm} isNew={isNew} cardInfo={cardInfo} taco={tacoProps}></AddToFarm>
                            <Stack direction="row-reverse" marginY={5}>
                                <Button colorScheme="figma.orange" isLoading={props.isSubmitting} type="submit">{isNew ? "Create item" : "Update metadata"}</Button>
                                <Button variant="outline" backgroundColor="white" onClick={() => {
                                    props.resetForm();
                                }} >Cancel</Button>

                            </Stack>
                        </Form>
                    )
                }
            }

        </Formik> :
            <Spinner></Spinner>}
    </GridContent>)
}

const DNumberInput = (props: { disabled?}) => (
    <Input type="number" backgroundColor="white" disabled={props.disabled} {...props}>
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
    meta.attributes = meta.attributes ? meta.attributes : [];
    const [att, setAtt] = useState([...meta.attributes]);

    useEffect(() => {
        setAtt([...meta.attributes])
    }, [meta])
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

function newNft(unifty: Unifty, toast, jsonUrl, erc, actions) {
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


function AddToFarm(props: { isNew: boolean, taco: TacoProps, cardInfo: ICardInfo, hasFarm: boolean }) {
    const [selected, setSelected] = useState<string>();

    const { isOpen, onOpen, onClose } = useDisclosure();


    const isVisible = !props.isNew;

    let options = [];
    if (props.hasFarm) {
        options.push(<TacoOption key={props.cardInfo.farmAddress} name={props.cardInfo.farmAddress}>{props.cardInfo.farmAddress==props.taco.unifty.tacoshiFarm?"Tacoshi's farm":"Tacoshi's rabbit hole"}</TacoOption>)
    } else {
        options.push(<TacoOption key={props.taco.unifty.tacoshiFarm} name={props.taco.unifty.tacoshiFarm}>Tacoshi's farm</TacoOption>)
        options.push(<TacoOption key={props.taco.unifty.rabbitFarm} name={props.taco.unifty.rabbitFarm}>Tacoshi's rabbit hole</TacoOption>)
    }
    return (<>{isVisible && <VStack border="1px solid" w="100%" borderColor="gray.300" padding={5} borderRadius={5} backgroundColor="white">
        <HStack fontSize="xl" fontWeight="bold"><GiFarmTractor></GiFarmTractor><Box>{props.hasFarm ? "Edit Farm information" : "Add NFT to Farm"}</Box></HStack>
        <TacoSwitch onChange={(index, name) => {
            setSelected(name);
        }}>
            {options}
        </TacoSwitch>
        <Button colorScheme="figma.orange" onClick={onOpen}>{props.hasFarm ? "Edit Farm prices" : "Add to Farm"}</Button>
    </VStack>}
        <ModalModifyFarm farmAddress={selected} isOpen={isOpen} cardInfo={props.cardInfo} unifty={props.taco.unifty} onClose={onClose} hasFarm={props.hasFarm}></ModalModifyFarm>
    </>)
}

function ModalModifyFarm(props: { hasFarm, isOpen, onClose, cardInfo: ICardInfo, unifty: Unifty, farmAddress: string }) {

    const { hasFarm, isOpen, onClose, cardInfo } = props;

    const [isApproved, setApproved] = useState(false);

    const callbacks = useTrasactionToaster({ title: "Adding nft", description: "Please wait..." }, { title: "Success!", description: "Your nft has been added to the farm" }, { title: "Error", description: "Some error has ocurred" })
    const callbacksApprove = useTrasactionToaster({ title: "Approving", description: "Please wait..." }, {
        title: "Success!",
        description: "Transaction has been approved",
        handler: () => { setApproved(true) }
    }, { title: "Error", description: "Some error has ocurred" })

    useEffect(() => {
        async function e() {
            if (props.unifty.account) {
                let approved = await props.unifty.erc1155IsApprovedForAll(props.unifty.account, props.farmAddress, cardInfo.erc1155)
                setApproved(approved);
            }

        }
        e();
    }, [cardInfo, props.unifty.account])

    const onSubmitFarm = async (vals) => {
        let approved = await props.unifty.erc1155IsApprovedForAll(props.unifty.account, props.farmAddress, cardInfo.erc1155)
        if (approved) {
            let points = props.unifty.web3.utils.toBN(props.unifty.resolveNumberString("" + vals.points, 18));
            let mintFee = props.unifty.web3.utils.toBN(props.unifty.resolveNumberString("" + vals.artistfee, 18));
            let controllerFee = props.unifty.web3.utils.toBN(props.unifty.resolveNumberString("" + vals.controllerfee, 18));

            await props.unifty.farmAddNfts(
                points.toString(),
                mintFee.toString(),
                controllerFee.toString(),
                vals.artistwallet,
                1,
                cardInfo.erc1155,
                cardInfo.id,
                "",
                CardTypes[vals.rarity],
                props.farmAddress
                , callbacks.onLoad, callbacks.onSuccess, callbacks.onError);
        } else {
            await props.unifty.erc1155SetApprovalForAll(props.farmAddress, true, cardInfo.erc1155, callbacksApprove.onLoad, callbacksApprove.onSuccess, callbacksApprove.onError);
        }
    }
    return (<Modal onClose={onClose} isOpen={isOpen}>
        <ModalOverlay></ModalOverlay>
        <ModalContent>
            <ModalHeader>{hasFarm ? "Edit farm info" : "Add to Farm"}</ModalHeader>
            <ModalBody>
                <Formik initialValues={{ points: 0, artistfee: 0, controllerfee: 0, artistwallet: "0x0000000000000000000000000000000000000000" }} onSubmit={(vals) => {
                    onSubmitFarm(vals)
                }}>
                    {(props) => {
                        useEffect(() => {
                            if (hasFarm) {
                                props.setValues({
                                    points: cardInfo.farmData.points,
                                    artistfee: Number(cardInfo.farmData.mintFee),
                                    controllerfee: Number(cardInfo.farmData.controllerFee),
                                    artistwallet: "0x0000000000000000000000000000000000000000"
                                })
                            }

                        }, [cardInfo])
                        return (
                            <Form>
                                <InputValidator name="rarity" placeholder="Rarity" label="Rarity">
                                    <Select backgroundColor="white" disabled={hasFarm} textTransform="capitalize">
                                        {Object.keys(CardTypes).map((value) => {
                                            return <option style={{ textTransform: "capitalize" }}>{value}</option>
                                        })}
                                    </Select>
                                </InputValidator>
                                <InputValidator name="points" validate={() => { }} placeholder="0" label="Points">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="artistfee" validate={() => { }} placeholder={0} label="Artist fee">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="controllerfee" validate={() => { }} placeholder={0} label="Controller fee" w="100%">
                                    <DNumberInput />
                                </InputValidator>
                                <InputValidator name="artistwallet" placeholder="Artist wallet" label="Artist Wallet" >
                                    <Input backgroundColor="white"></Input>
                                </InputValidator>

                                <Box marginY={5}><Button type="submit" colorScheme="blue">{!isApproved ? "Approve first" : hasFarm ? "Edit Farm info" : "Add to Farm"}</Button></Box>
                            </Form>

                        )
                    }}
                </Formik>

            </ModalBody>
        </ModalContent>

    </Modal>)
}