import { Box, Button, chakra, Flex, FormControl, FormErrorMessage, FormLabel, Input, Textarea, useToast } from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import GridContent from "../../../src/components/GridContent";
import Unifty from "../../../src/uniftyLib/UniftyLib";

export default function ManageCollection(props: { unifty: Unifty }) {
    const router = useRouter();
    const collection = router.query.managecollection as string;
    const toast = useToast();
    const [data, setMeta] = useState({ erc: {}, meta: { image: "", name: undefined } });

    useEffect(() => {

        async function func() {
            let connected = await props.unifty.isConnected();
            if (connected) {
                let erc = await props.unifty.getMyErc1155(collection)
                let realmeta = await props.unifty.readUri(erc.contractURI);

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
            <Box minWidth="300px" height="180px" overflow="hidden" marginRight={10}
                backgroundImage={data.meta.image != undefined ? "url(" + data.meta.image + ")" : "none"} backgroundPosition="center"
                backgroundSize="500px" borderRadius="lg">
            </Box>
            <Box flexGrow={2}>
                {data.meta.name != undefined && <FormEdit id={collection} toast={toast} data={data} unifty={props.unifty}></FormEdit>}
            </Box>
        </Flex>}
    </GridContent>)
}

function FormEdit({ toast, unifty, data, id }) {
    data["id"] = id;
    console.log(data)
    toast = useToast();

    return (
        <Formik
            initialValues={{ name: data.meta.name, ticker: data.erc.symbol, description: data.meta.description }}
            onSubmit={(values, actions) => {
                onSubmit(values, actions, toast, unifty, data);
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


async function onSubmit(values, actions, toast, unifty, data) {
    console.log("Values", values)
    let contractInfo = {
        name: values.name,
        description: values.description,
        image: "",
        external_link: ""
    };
    let toastTime = 20000;
    let toastPosition = "bottom-right     "

    let u = (unifty as Unifty);
    let ipfs = await u.ipfs.add(JSON.stringify(contractInfo))

    let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path;

    console.log(data.erc.erc1155)

    toast({
        title: "Transaction started.",
        description: "Please wait...",
        status: "info",
        duration: 1000,
        position: "bottom-left",
        isClosable: true,
    })

    u.setContractURI(data.erc.erc1155, ipfsUrl,
        (e) => {
            console.log("precall", e)
        },
        e => { console.log("postcall", e) },
        e => { console.error("error", e) })

}