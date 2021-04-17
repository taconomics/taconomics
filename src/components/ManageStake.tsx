import { Box, Button, Flex, FormControl, FormHelperText, Image, FormLabel, HStack, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure, VStack, Center, Spinner } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import Unifty from "../uniftyLib/UniftyLib";
import { TacoOption, TacoSwitch } from "./TacoSwitch";
const Cubiertos_Icon = "/icons/Cubiertos_Icon.svg";
export default function ManageStake(props: { unifty: Unifty, isOpen, onOpen, onClose }) {
    const [isTaco, setIsTaco] = useState(true);
    const [amount, setAmount] = useState(0);
    const onChange = (index, name) => {
        if (name == "taco") {
            setIsTaco(true)
        } else {
            setIsTaco(false)
        }
    }
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="2xl" >
            <ModalOverlay />
            <ModalContent padding={5}>
                <ModalCloseButton />
                <ModalBody>
                    <Switch c={onChange}></Switch>
                    <StakeDescription isTaco={isTaco}></StakeDescription>
                    <HStack>
                        <FormControl>
                            <FormLabel fontWeight="bold">Staking options</FormLabel>
                            <Select placeholder="Stake">
                                <option value="unstake">Unstake</option>
                            </Select>
                        </FormControl>

                        <FormControl>
                            <FormLabel fontWeight="bold">Amount</FormLabel>
                            <InputGroup size="md">
                                <Input
                                    pr="4.5rem"
                                    type={"number"}
                                    name="stake_amount"
                                    placeholder="0.0"
                                   
                                    onChange={(e)=>{
                                        console.log(e.target);
                                        
                                    }}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button h="1.75rem" size="sm" variant="outline" colorScheme="figma.orange">
                                        MAX
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <StakeButton stake_amount={amount} unifty={props.unifty} isTaco={isTaco}></StakeButton>
                    </HStack>
                    <AmountStaked unifty={props.unifty} isTaco={isTaco}></AmountStaked>
                </ModalBody>
            </ModalContent>
        </Modal>)
}

function StakeButton(props: { stake_amount, unifty: Unifty, isTaco }) {
    let { stake_amount, unifty, isTaco } = props;
    useEffect(() => {
        async function func() {
            const address = unifty.getFarmAddress(isTaco);
            let decimals = await unifty.farmTokenDecimals(address);
            stake_amount = unifty.resolveNumberString(stake_amount, decimals);
        }

    }, [])
    return (<Flex paddingTop={"2rem"}>
        <Button size="md" colorScheme="figma.orange" paddingX={5}><Image paddingRight={2} height={5} src={Cubiertos_Icon}></Image><Box>Stake</Box></Button>
    </Flex>)
}

function Switch({ c }) {
    return (
        <Center width="100%">
            <Flex padding={5} backgroundColor="white" alignItems="center" justifyContent="center" shadow="lg" width={["80%", "60%", "30vw"]} borderRadius="lg" marginBottom={5}>
                <TacoSwitch onChange={c}>
                    <TacoOption key="taco" name="taco">Stake TACO</TacoOption>
                    <TacoOption key="salsa" name="salsa">Stake Salsa</TacoOption>
                </TacoSwitch>
            </Flex>
        </Center>)
}

function StakeDescription({ isTaco }) {
    const coin = isTaco ? "$TACO" : "$Salsa";
    const give = isTaco ? "lemon" : "chili";
    const gives = give + "s";
    return (
        <VStack marginBottom={5} alignItems="start" justifyContent="start">
            <Box fontWeight="bold">Deposit {coin}, earn {gives}, Mint NFTs.</Box>
            <Box color="gray.300">Staking 1 {coin} token in the pool earns you roughly 1 {give} per day. With enough {gives}, you can mint an exclusive edition NFT.</Box>
        </VStack>)
}

function AmountStaked(props: { isTaco, unifty: Unifty }) {
    const coin = props.isTaco ? "$TACO" : "$Salsa";

    const [staked, setStaked] = useState(<Spinner size="sm"></Spinner>);
    const [minmax, setMinMax] = useState({ min: 0, max: 0 });

    useEffect(() => {
        async function func() {
            const address = props.unifty.getFarmAddress(props.isTaco);
            const s = await props.unifty.farmBalanceOf(address, props.unifty.account);
            setStaked(<Box marginRight={1}>{s}</Box>);
            const max = await props.unifty.farmMaxStake(address)
            const min = await props.unifty.farmMinStake(address)

            setMinMax({ min: min, max: max });
        }
        func();

    }, [props.isTaco])
    return (<Flex marginY={5} color="gray.600">You currently are staking <Flex marginX={1} fontWeight="bold">{staked} {coin}</Flex> - The maximum is {minmax.max} {coin}.</Flex>)
}