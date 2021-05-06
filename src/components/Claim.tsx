import { Box, Button, Center, Flex, HStack, Modal, ModalBody, Image, ModalCloseButton, ModalContent, ModalOverlay, useDisclosure, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTrasactionToaster } from "../hooks/useTransactionToaster";
import Unifty from "../uniftyLib/UniftyLib";
import TacoSwitch, { TacoOption } from "./TacoSwitch";

export default function Claim(props: { unifty: Unifty, isOpen, onClose }) {
    const [page, setPage] = useState("tacoshi")
    const [pending, setPending] = useState(0);
    const address = page == "tacoshi" ? props.unifty.tacoshiFarm : props.unifty.rabbitFarm;

    const {onLoad,onSuccess,onError} = useTrasactionToaster({title:"Claiming",description:"Please wait..."},{title:"Claiming",description:"Success!"},{title:"Error",description:"Some error has occurred."})

    const onChange = (a, e) => {
        setPage(e);
    }
    const onClaim = async () => {
        props.unifty.farmWithdrawFees(address,onLoad,onSuccess,onError);
    }

    useEffect(() => {
        async function f() {

            let pending = await props.unifty.farmPendingWithdrawals(props.unifty.account, address);
            setPending(Number(props.unifty.formatNumberString(pending, 18)));
        }
        f()
    }, [page])
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="2xl" >
            <ModalOverlay />
            <ModalContent padding={5}>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <Switch c={onChange}></Switch>
                        <HStack fontSize="xl">
                            <Box>You have earned</Box>
                            <Image src="/icons/Eth_Icon.svg" h={"20px"}></Image>
                            <Box>{pending}</Box>
                            <Box>in this farm.</Box>

                        </HStack>
                        <Button colorScheme="figma.orange" disabled={pending<=0} onClick={onClaim}><HStack><Image src="/icons/Claim_Icon.svg"></Image><Box>Claim</Box></HStack></Button>
                    </VStack>


                </ModalBody>
            </ModalContent>
        </Modal>)
}


function Switch({ c }) {
    return (
        <Center width="100%">
            <Flex padding={5} backgroundColor="white" alignItems="center" justifyContent="center" shadow="figma" width={["80%", "60%", "30vw"]} borderRadius="lg" marginBottom={5}>
                <TacoSwitch onChange={c}>
                    <TacoOption key="tacoshi" name="tacoshi">Tacoshi's farm</TacoOption>
                    <TacoOption key="rabbit" name="rabbit">Tacoshi's rabbit hole</TacoOption>

                </TacoSwitch>
            </Flex>
        </Center>)
}