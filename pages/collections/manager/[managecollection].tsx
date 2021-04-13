import { Box, Button, Center, chakra, Flex, FormControl, FormErrorMessage, FormLabel, HStack, Input, Textarea, useToast } from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import GridContent from "../../../src/components/GridContent";
import Unifty from "../../../src/uniftyLib/UniftyLib";
import { getCollectionCards } from "../[collection]";

export default function ManageCollection(props: { unifty: Unifty }) {
    const router = useRouter();
    const collection = router.query.managecollection as string;
    const toast = useToast();
    const [data, setMeta] = useState({ erc: {}, meta: { name: undefined } });
    const [image, setImage] = useState("");

    useEffect(() => {

        async function func() {
            let connected = await props.unifty.isConnected();
            if (connected) {
                let erc = await props.unifty.getMyErc1155(collection)
                let realmeta = await props.unifty.readUri(erc.contractURI);
                setImage(realmeta.image);
                setMeta({ erc: erc, meta: realmeta });
            }

        }
        if (collection != undefined) {
            func();
        }

    }, [collection])
    return (<GridContent>
        <Box fontSize="x-large" fontWeight="bold" marginBottom={5}>Edit collection</Box>
        {data.meta != undefined && <Flex>
            <CollectionImage unifty={props.unifty} setImage={setImage} image={image}></CollectionImage>
            <Box flexGrow={2}>
                {data.meta.name != undefined && <FormEdit image={image} id={collection} toast={toast} data={data} unifty={props.unifty}></FormEdit>}
            </Box>
        </Flex>}
        <CollectionItems unifty={props.unifty} collection={data.erc}></CollectionItems>
    </GridContent>)
}

function CollectionItems(props: { unifty: Unifty, collection: any }) {
    const [items, set] = useState([]);
    useEffect(() => {
        async function name() {
            if (props.collection.erc1155 != undefined) {
                console.log("Items collection", props.collection.erc1155)
                let items = await getCollectionCards(props.unifty, props.collection.erc1155);
                console.log(items);
                set(items);
            }

        }
        name();
    }, [props.collection])
    return (
        <Box>
            <Box fontSize="xl" fontWeight="bold">Items</Box>
            <HStack>{items}</HStack>
        </Box>)
}
function CollectionImage({ image, setImage, unifty }) {
    const [hover, setHover] = useState(false)
    const onEnter = () => {
        setHover(true);
    }
    const onExit = () => {
        setHover(false);
    }

    const uploadPhoto = () => {

    }
    return (<Box minWidth="300px" height="180px" overflow="hidden" marginRight={10} onPointerEnter={onEnter} onPointerLeave={onExit}

        backgroundImage={image != undefined ? "url(" + image + ")" : "none"} backgroundPosition="center"
        backgroundSize="500px" borderRadius="lg">
        {<Center backgroundColor="blackAlpha.400" height="100%" marginTop={hover ? "0%" : "100%"} transition="margin-top .5s">
            <FileUpload unifty={unifty} setImage={setImage}></FileUpload>
        </Center>}
    </Box>)
}
const FileUpload = ({ setImage, unifty }) => {
    const inputRef = useRef<HTMLInputElement>();
    const [file, setFile] = useState(undefined)
    const u: Unifty = unifty;
    const clickButton = () => {
        inputRef.current.click();
    }
    const handleFileInput = (e) => {
        // handle validations

        var reader = new FileReader();
        reader.onload = async function () {
            console.log(reader.result)
            setFile(reader.result)
            let ipfs = await u.ipfs.add(reader.result);
            let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path;
            setImage(ipfsUrl);
            console.log(ipfsUrl);
        };
        reader.readAsArrayBuffer(e.target.files[0]);

    }
    return (<Box>
        <input style={{ display: "none" }} ref={inputRef} type="file" accept="image/*" onChange={handleFileInput} />
        <Button variant="outline" colorScheme="figma.white" onClick={clickButton}>Chosse photo</Button>
    </Box>)
}

function FormEdit({ toast, unifty, data, id, image }) {
    data["id"] = id;
    console.log(data)
    toast = useToast();

    return (
        <Formik
            initialValues={{ name: data.meta.name, ticker: data.erc.symbol, description: data.meta.description }}
            onSubmit={(values, actions) => {
                onSubmit(values, actions, toast, unifty, data, image);
            }}
        >
            {(props) => (
                <Form>
                    <DField w={"60%"} name="name" label={"Collection name"} placeholder="Collection name"></DField>
                    <DField w={"60%"} name="ticker" label={"Ticker"} placeholder="Ticker"></DField>
                    <DTextArea w={"100%"} name="description" label={"Description"} placeholder="Collection description." />
                    <Button
                        mt={4}
                        colorScheme="figma.orange"
                        isLoading={props.isSubmitting}
                        type="submit"
                    >
                        Save changes
                    </Button>
                </Form>
            )}
        </Formik>
    )
}

function DField({ name, placeholder, label, w }) {
    const m = <Field name={name} validate={validateName}>
        {({ field, form }) => {
            return (<FormControl isInvalid={form.errors[name] && form.touched[name]}>
                <FormLabel htmlFor={name}>{label}</FormLabel>
                <Input backgroundColor="white" {...field} id={name} placeholder={placeholder} />
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>)

        }}
    </Field>;
    return <Box w={w}>{m}</Box>;
}
function DTextArea({ name, placeholder, label, w }) {
    const m = <Field name={name} validate={validateName}>
        {({ field, form }) => {
            return (<FormControl isInvalid={form.errors[name] && form.touched[name]}>
                <FormLabel htmlFor={name}>{label}</FormLabel>
                <Textarea minH={"200px"} backgroundColor="white" {...field} id={name} placeholder={placeholder} />
                <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
            </FormControl>)

        }}
    </Field>;
    return <Box w={w}>{m}</Box>;
}

function validateName(value) {
    let error
    if (!value) {
        error = "Field is required"
    }
    return error
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