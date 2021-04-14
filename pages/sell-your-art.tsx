import { Box, Button, Flex, HStack, Textarea, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import Image from 'next/image';
import React from "react";
import GridContent from "../src/components/GridContent";
import InputValidator from "../src/components/InputValidator";
import Unifty from "../src/uniftyLib/UniftyLib";

export default function (props: { unifty: Unifty }) {
    return (<GridContent marginBottom={20}>
        <Flex flexDirection={["column","column","row"]} alignItems={["center","center","start"]}>
            <BePart></BePart>
            <ContactUs></ContactUs>
        </Flex>

    </GridContent>)
}

function BePart(props) {
    return (<VStack flexGrow={1} padding={5}>
        <Box fontSize="xx-large" fontWeight="extrabold" paddingRight={5}>Be part of Taconomics community and get yourself know as an artist.</Box>
        <Box width="300px"><Image src="/img/taco-artist.svg" layout="responsive" width="200px" height="200px"></Image></Box>
    </VStack>)
}

function ContactUs() {
    return (<Box flexGrow={6}  backgroundColor="white" shadow="xl" padding={5} width={["100%","100%","60%"]} borderRadius="lg">
        <Box fontWeight="extrabold" fontSize="lg" marginBottom={10}>Contact us on social media or leave a message.</Box>
        <Formik initialValues={{ name: "" }} onSubmit={(values, actions) => { }}>
            {
                (props) => {
                    return (
                        <Form>
                            <VStack spacing={"5"}>
                                <InputValidator name="name" placeholder="Your full name." label="Full name">
                                </InputValidator>
                                <InputValidator name="email" placeholder="Your Email." label="Email">
                                </InputValidator>
                                <InputValidator name="message" placeholder="Your message." label="Message">
                                    <Textarea></Textarea>
                                </InputValidator>
                                <Button alignSelf="start" colorScheme="figma.orange" paddingLeft={10} paddingRight={10}>Submit</Button>
                            </VStack>

                        </Form>

                    )
                }
            }

        </Formik>

    </Box>)
}