import { Box, Button, Center, Flex, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Textarea, useDisclosure, VStack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import GridContent from "../src/components/GridContent";
import InputValidator from "../src/components/InputValidator";
import Unifty from "../src/uniftyLib/UniftyLib";
import emailjs, { init } from 'emailjs-com';
import { useRef } from "react";
import { SocialIcons } from "../src/components/SocialIcons";

export default function SellYourArtPage(props: { unifty: Unifty }) {
    return (<GridContent marginBottom={20}>
        <Flex flexDirection={["column", "column", "row"]} alignItems={["center", "center", "start"]}>
            <BePart></BePart>
            <ContactUs></ContactUs>
        </Flex>

    </GridContent>)
}

function BePart(props) {
    return (<VStack flexGrow={1} padding={5}>
        <Box fontSize="xx-large" fontWeight="extrabold" paddingRight={5}>Be part of Taconomics community and get yourself know as an artist.</Box>
        <Box width="300px"><Image src="/img/taco-artist.svg" width="500px" height="500px"></Image></Box>
    </VStack>)
}

function ContactUs() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const formref = useRef<HTMLFormElement>();

    return (<Box flexGrow={6} backgroundColor="white" shadow="xl" padding={5} width={["100%", "100%", "60%"]} borderRadius="lg">
        <ThanksModal isOpen={isOpen} onClose={onClose}></ThanksModal>
        <Box fontWeight="extrabold" fontSize="lg" marginBottom={5}>Contact us on social media or leave a message.</Box>
        <SellSocialIcons></SellSocialIcons>
        <Formik initialValues={{ name: "" }} onSubmit={(values, actions) => {
            onOpen()
            // sendEmail(formref.current);
        }}>
            {
                (props) => {
                    console.log("errors", props)
                    return (
                        <Form ref={formref}>
                            <VStack spacing={"5"}>
                                <InputValidator name="name" placeholder="Your full name." label="Full name">
                                </InputValidator>
                                <InputValidator name="email" placeholder="Your Email." label="Email">
                                </InputValidator>
                                <InputValidator name="message" placeholder="Your message." label="Message">
                                    <Textarea></Textarea>
                                </InputValidator>
                                <Button type="submit" alignSelf="start" colorScheme="figma.orange" paddingLeft={10} paddingRight={10}>Submit</Button>
                            </VStack>

                        </Form>

                    )
                }
            }

        </Formik>

    </Box>)
}

function ThanksModal({ isOpen, onClose }) {
    const size="150px"
    return (<Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>

            <ModalCloseButton />
            <ModalBody>
                <VStack textAlign="center">
                    <Image src="/icons/taco_icon.svg" width={size} height={size}></Image>
                    <Box fontWeight="bold" fontSize="lg">Thanks for reaching out!</Box>
                    <Box>Our team will get in contact with you as soon as possible.</Box>
                </VStack>
            </ModalBody>
            <ModalFooter w="100%">
                <Center  w="100%"><Button onClick={onClose} colorScheme="figma.orange" paddingX={7}>Go back</Button></Center>
            </ModalFooter>
        </ModalContent>
    </Modal>)
}

function SellSocialIcons() {
    return <SocialIcons size={20} Container={SellSocialContainer} marginBottom={2} iconColor="black" alignItems="center" justifyContent="center"></SocialIcons>

}
function SellSocialContainer(props) {
    return (<Box padding={1} marginX={1} borderRadius="full" border="1px solid black">{props.children}</Box>)
}

async function sendEmail(form: HTMLFormElement) {
    let i = init("user_JkJBZ6GPc0fnHDkELaHFs");

    let response = await emailjs.sendForm("service_1lgrnn9", "template_tj7r92o", form);

    console.log("email response", response);

}