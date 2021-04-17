import { Box, Button, Flex, FormControl, FormHelperText, Image, FormLabel, HStack, Input, InputGroup, InputRightElement, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, useDisclosure, VStack, Center, Spinner, Alert, AlertIcon, AlertDescription, AlertTitle, toast, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { useTrasactionToaster } from "../hooks/useTransactionToaster";
import Unifty from "../uniftyLib/UniftyLib";
import { TacoOption, TacoSwitch } from "./TacoSwitch";
const Cubiertos_Icon = "/icons/Cubiertos_Icon.svg";
export default function ManageStake(props: { unifty: Unifty, isOpen, onOpen, onClose }) {
    const [isTaco, setIsTaco] = useState(true);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState({ title: undefined, description: undefined });
    const onChange = (index, name) => {
        if (name == "taco") {
            setIsTaco(true)
        } else {
            setIsTaco(false)
        }
    }
    const [staked, setStaked] = useState(<Spinner size="sm"></Spinner>);
    const [minmax, setMinMax] = useState({ min: 0, max: 0 });
    const [farmBalance, setFarmBalance] = useState(0);

    useEffect(() => {
        async function func() {
            const address = props.unifty.getFarmAddress(isTaco);
            updateBalance();
            const max = await props.unifty.farmMaxStakeRaw(address)
            const min = await props.unifty.farmMinStakeRaw(address)

            setMinMax({ min: min, max: max });

            let balance = await props.unifty.farmBalanceOfRaw(address, props.unifty.account);

            setFarmBalance(balance);
        }
        func();

    }, [isTaco])

    async function updateBalance() {
        const address = props.unifty.getFarmAddress(isTaco);
        const s = await props.unifty.farmBalanceOf(address, props.unifty.account);
        setStaked(<Box marginRight={1}>{s}</Box>);
    }
    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} isCentered size="2xl" >
            <ModalOverlay />
            <ModalContent padding={5}>
                <ModalCloseButton />
                <ModalBody>
                    {error.title != undefined && <Alert status={"error"}>
                        <AlertIcon></AlertIcon>
                        <AlertTitle mr={2}>{error.title}</AlertTitle>
                        <AlertDescription>{error.description}</AlertDescription>
                    </Alert>}
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
                                    value={amount}
                                    onChange={(e) => {
                                        setAmount(parseFloat(e.target.value))
                                    }}
                                />
                                <InputRightElement width="4.5rem">
                                    <Button onClick={() => { setAmount(minmax.max) }} h="1.75rem" size="sm" variant="outline" colorScheme="figma.orange">
                                        MAX
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <StakeButton updateBalance={updateBalance} setError={setError} minmax={minmax} balance={farmBalance} stake_amount={amount} unifty={props.unifty} isTaco={isTaco}></StakeButton>
                    </HStack>
                    <AmountStaked minmax={minmax} staked={staked} unifty={props.unifty} isTaco={isTaco}></AmountStaked>
                </ModalBody>
            </ModalContent>
        </Modal>)
}

function StakeButton(props: { stake_amount, unifty: Unifty, isTaco, balance, minmax, setError, updateBalance }) {
    let { stake_amount, unifty, isTaco, setError, updateBalance } = props;

    const [buttonStatus, setButtonStatus] = useState({ text: "Stake", isLoading: false, disabled: false });
    const toast = useToast();

    const allowERC20Toaster = useTrasactionToaster({ title: "Approve first", description: "Please wait. ---NEED TO CHANGE" },
        { title: "Approved.", description: "Thank you! Now you can Stake!", handler: () => { setButtonStatus({ ...buttonStatus, text: "Stake" }) } },
        {
            title: "Error", description: "Some error ocurred...", handler: () => {
                setButtonStatus({ ...buttonStatus, disabled: false })
            }
        }, { showError: true })

    const stakeToaster = useTrasactionToaster({ title: "Transaction is pending...", description: "Please wait" },
        {
            title: "Approved.", description: "Thank you for staking!", handler: () => {
                setButtonStatus({ ...buttonStatus, isLoading: false })
                updateBalance();
            }

        },
        { title: "Error", description: "Some error ocurred..." }, { showError: true })
    const onClick = async () => {

        const address = unifty.getFarmAddress(isTaco);
        let decimals = await unifty.farmTokenDecimals(address);
        stake_amount = unifty.resolveNumberString("" + stake_amount, decimals);
        let balance = props.balance;
        console.log("balance", balance)

        let added = stake_amount;
        console.log("added", added)
        if (added == 0 || added < props.minmax.min || added > props.minmax.max) {
            let maxStakesLeft = props.unifty.web3.utils.toBN(await unifty.farmMaxStakeRaw(unifty.getFarmAddress(isTaco))).sub(unifty.web3.utils.toBN(balance));

            let format = unifty.formatNumberString(maxStakesLeft.toString(), decimals)

            setError({ description: "Left for staking: " + format.split(".")[0], title: "Please stake with the proper amounts." });
        } else {
            setError({ title: undefined, description: undefined })
            let farmToken = await unifty.farmToken(address);
            if (
                await unifty.allowanceErc20Raw(
                    farmToken,
                    unifty.account,
                    address
                ) < parseInt(stake_amount)
            ) {
                setButtonStatus({ ...buttonStatus, text: "Approve first", disabled: true })

                await unifty.approveErc20(
                    farmToken,
                    stake_amount,
                    address,
                    allowERC20Toaster.onLoad,
                    allowERC20Toaster.onSuccess,
                    allowERC20Toaster.onError);

            } else {
                console.log("Already approved")
                setButtonStatus({ ...buttonStatus, text: "Stake" })
                await unifty.farmStake(address, stake_amount, stakeToaster.onLoad, stakeToaster.onSuccess, stakeToaster.onError);
                setButtonStatus({ isLoading: true, text: "Stake", disabled: true })
            }

        }
    };
    return (<Flex paddingTop={"2rem"}>
        <Button size="md" colorScheme="figma.orange" disabled={buttonStatus.disabled} isLoading={buttonStatus.isLoading} onClick={onClick} paddingX={5}><Image paddingRight={2} height={5} src={Cubiertos_Icon}></Image>
            <Box>{buttonStatus.text}</Box>
        </Button>
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

function AmountStaked(props: { isTaco, unifty: Unifty, minmax, staked }) {
    const coin = props.isTaco ? "$TACO" : "$Salsa";

    return (<Flex marginY={5} color="gray.600">You currently are staking <Flex marginX={1} fontWeight="bold">{props.staked} {coin}</Flex>
        - The maximum is {props.minmax.max} {coin} and minimun is {props.minmax.min}.</Flex>)
}