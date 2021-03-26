import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, useToast } from "@chakra-ui/react";
import { Field, Form, Formik, useFormik } from "formik";
import React from "react";
import Unifty from "../../src/uniftyLib/UniftyLib";

export default function CreateCollection({ unifty }) {
    const toast = useToast()
    return (<Box>
        <Box>Create collection</Box>
        <Formik
            initialValues={{ name: "Sasuke" }}
            onSubmit={(values, actions) => {
                onSubmit(values, actions, toast, unifty);
            }}
        >
            {(props) => (
                <Form>
                    <Field name="name" validate={validateName}>
                        {({ field, form }) => (
                            <FormControl isInvalid={form.errors.name && form.touched.name}>
                                <FormLabel htmlFor="name">Collection name</FormLabel>
                                <Input {...field} id="name" placeholder="name" />
                                <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                            </FormControl>
                        )}
                    </Field>
                    <Button
                        mt={4}
                        colorScheme="teal"
                        isLoading={props.isSubmitting}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Form>
            )}
        </Formik>
    </Box>)
}

async function onSubmit(values, actions, toast, unifty) {
    let contractInfo = {
        name: values.name,
        description: "",
        image: "",
        external_link: ""
    };
    let toastTime = 20000;
    let toastPosition = "bottom-right     "

    let u = (unifty as Unifty);
    let ipfs = await u.ipfs.add(JSON.stringify(contractInfo))

    console.log(ipfs)
    let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs;

    u.newErc1155(contractInfo.name, "Ticker", ipfsUrl, u.defaultProxyRegistryAddress,
        ((e) => {
            console.log("Precall", e)
            toast({
                title: "Transaction started.",
                description: "Please wait...",
                status: "info",
                duration: toastTime,
                position:toastPosition,
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
                position:toastPosition,
                isClosable: true,
            })
        }),
        ((e) => {
            console.log("Error", e);
            toast({
                title: "An error has occurred.",
                description: "CODE: "+e.code+ " - Message: "+e.message,
                status: "error",
                duration: toastTime,
                position:toastPosition,
                isClosable: true,
            })
        })
    )
    actions.resetForm();
}

function validateName(value) {
    let error
    if (!value) {
        error = "Name is required"
    }
    return error
}