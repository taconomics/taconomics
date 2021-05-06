import { Button, HStack, Menu, MenuButton, Image, MenuList, Box, Flex, useMediaQuery, Link, useDisclosure, useInterval, Input, MenuItem, Center, VStack } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { useEffect } from "react";
import Unifty from "../../uniftyLib/UniftyLib";
import NextLink from 'next/link'
import ManageStake from "../ManageStake";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { TacoProps } from "../TacoLayout";
import Claim from "../Claim";


const Lemon_Icon = "/icons/Lemon_Icon.svg";
const Chile_Icon = "/icons/Chile_Icon.svg";
const DownArrow_Icon = "/icons/DownArrow_Icon.svg";
const Wallet_Icon = "/icons/Wallet_Icon.svg";
const Taco_Icon = "/icons/Taco_Icon.svg";
const Molcajete_Icon = "/icons/Molcajete_Icon.svg";
const Cubiertos_Icon = "/icons/Cubiertos_Icon.svg";



export default function UserWallet(props: { unifty: Unifty, changer: number, variant?: string }) {
    const [isConnected, setIsConnected] = useState(false);
    let onClickConnect = () => {
        console.log("Requested account");
        props.unifty.getAccount();
    }

    useEffect(() => {
        async function con() {
            let connected = await props.unifty.isConnected();
            console.log("Is connected", connected)
            setIsConnected(connected && props.unifty.hasWallet);
        }
        con();
    }, [props.changer])


    return (<Box flexGrow={{ md: 1, lg: 1.3 }} zIndex={1000} >
        {
            !isConnected ?

                <ButtonConnect onClickConnect={onClickConnect}></ButtonConnect>
                :

                <WalletContainer changer={props.changer} variant={props.variant} unifty={props.unifty}></WalletContainer>

        }
    </Box>)
}

function WalletContainer(props: { unifty: Unifty, changer, variant?}) {
    const [isWhitelist, setWhitelist] = useState(false);

    useEffect(() => {
        async function f() {
            await props.unifty.isConnected();
            const rabbit = await props.unifty.farmIsWhitelistAdmin(props.unifty.account, props.unifty.rabbitFarm);
            const tacoshi = await props.unifty.farmIsWhitelistAdmin(props.unifty.account, props.unifty.tacoshiFarm);
            setWhitelist(rabbit || tacoshi);
        }
        f()
    }, [props.changer])
    return (
        <Flex width={["auto", "auto", "100%"]} flexDir={["column", "column", "row"]} alignItems={["start", "start", "center"]} justifyContent={"space-between"}>

            {isWhitelist && <Box fontFamily="Nunito" fontWeight="extrabold"><NextLink href="/collections/manager">Collection manager</NextLink></Box>}
            <Box fontFamily="Nunito" fontWeight="extrabold"><NextLink href="/my-items">My items</NextLink></Box>
            <MyEarnings unifty={props.unifty}></MyEarnings>
            <Coins changer={props.changer} unifty={props.unifty}></Coins>
        </Flex>)


}

function Coins(props: { unifty: Unifty, changer }) {
    const [chilesBalance, setChiles] = useState(0);
    const [lemonBalance, setLemons] = useState(0);
    async function func() {
        let connected = await props.unifty.isConnected();
        let chilesPoints = await props.unifty.farmPointsEarned(props.unifty.tacoshiFarm, props.unifty.account);
        let lemonPoints = await props.unifty.farmPointsEarned(props.unifty.rabbitFarm, props.unifty.account);
        setChiles(Math.ceil(chilesPoints));
        setLemons(Math.ceil(lemonPoints));
    }
    useEffect(() => {
        func();
    }, [props.changer])
    useInterval(func, 1000);

    let iconSize = 6;
    let padding = 10;
    return (<TacoButtonBox lemonBalance={lemonBalance} chilesBalance={chilesBalance}>
        <ManageStakeMenu changer={props.changer} unifty={props.unifty} />
    </TacoButtonBox>)
}


export function Coin({ iconSize, img, balance, spacing, children = undefined }) {
    return (<HStack paddingLeft={spacing}><Image height={iconSize} src={img}></Image>
        <Box color="black" marginLeft={3} fontWeight="extrabold">{balance}</Box>
        <Box>{children}</Box>
    </HStack>)
}


function ButtonConnect({ onClickConnect }) {
    return (<Center>
        <Button onClick={onClickConnect} colorScheme="blackButton" leftIcon={<Image width="20px" src={Wallet_Icon} />}>Connect wallet</Button>
    </Center>)
}

function ManageStakeMenu(props: { unifty: Unifty, changer }) {
    const [taco, setTaco] = useState(0);
    const [salsa, setSalsa] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {
        async function name() {
            await props.unifty.isConnected();
            let tacoStake = await props.unifty.farmBalanceOf(props.unifty.rabbitFarm, props.unifty.account)
            let salsaStake = await props.unifty.farmBalanceOf(props.unifty.tacoshiFarm, props.unifty.account)

            setTaco(tacoStake);
            setSalsa(salsaStake);

        }
        name();
    }, [isOpen, props.changer])
    let iconSize = "20px"
    let marginTop = "20px"
    return (<Flex flexDir="column" alignItems="center">
        <Flex marginTop={marginTop}><Coin balance={taco} iconSize={iconSize} img={Taco_Icon} spacing={0} >Stacked</Coin></Flex>
        <Flex marginTop={marginTop}><Coin balance={salsa} iconSize={iconSize} img={Molcajete_Icon} spacing={0} >Stacked</Coin></Flex>
        <Button marginTop="20px" onClick={onOpen} colorScheme="blackButton"><Image paddingRight={2} height={5} src={Cubiertos_Icon}></Image>Manage Stake</Button>
        <ManageStake unifty={props.unifty} isOpen={isOpen} onClose={onClose} onOpen={onOpen}></ManageStake>
    </Flex>)
}

function MyEarnings(props: { unifty: Unifty }) {
    const [isOpenMyEarn, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const { isOpen, onClose, onOpen } = useDisclosure();

    const [earned,setEarned] = useState(0);

    useEffect(()=>{
        async function f(){
            let tacoshi = await props.unifty.farmPendingWithdrawals(props.unifty.account,props.unifty.tacoshiFarm);
            let rabbit = await props.unifty.farmPendingWithdrawals(props.unifty.account,props.unifty.rabbitFarm);

            let total = tacoshi+rabbit;
            setEarned(Number(props.unifty.formatNumberString(total, 18)));
        }
        f();
    },[isOpenMyEarn])

    useOutsideAlerter(wrapperRef, setOpen);
    return (<Box position="relative" ref={wrapperRef}>
        <Button as={Button} colorScheme="transparent" onClick={() => { setOpen(!isOpenMyEarn) }} margin={0}>
            <Box fontWeight="bold" color="black">My earnings</Box>
        </Button>
        {<TacoButtonBoxItem setOpen={setOpen} isOpen={isOpenMyEarn}>
            <VStack textAlign="center">
                <Box><Image src="/icons/Eth_Icon.svg"></Image></Box>
                <Box color="gray.600" fontSize="sm">You have earned</Box>
                <Box fontWeight="bold">{earned} ETHS</Box>
                <Button colorScheme="figma.orange" onClick={onOpen}><HStack><Image src="/icons/Claim_Icon.svg"></Image><Box>Claim</Box></HStack></Button>
            </VStack>
        </TacoButtonBoxItem>}
        <Claim unifty={props.unifty} isOpen={isOpen} onClose={onClose}></Claim>
    </Box>)
}

/////////////////////////

function TacoButtonBox({ lemonBalance, chilesBalance, children }) {
    let iconSize = 6;
    let padding = 10;
    const [isOpen, setOpen] = useState(false);
    const wrapperRef = useRef(null);

    useOutsideAlerter(wrapperRef, setOpen);

    return <Box position="relative" ref={wrapperRef}>
        <Button as={Button} colorScheme="transparent" onClick={() => { setOpen(!isOpen) }} margin={0}>
            <HStack>
                <Coin spacing={padding} iconSize={iconSize} balance={lemonBalance} img={Lemon_Icon}></Coin>
                <Coin spacing={padding} iconSize={iconSize} balance={chilesBalance} img={Chile_Icon}></Coin>
                <Image marginLeft={30} height={2} src={DownArrow_Icon}></Image>

            </HStack>
        </Button>
        {<TacoButtonBoxItem setOpen={setOpen} isOpen={isOpen}>{children}</TacoButtonBoxItem>}
    </Box>
}

function TacoButtonBoxItem({ children, setOpen, isOpen }) {
    return (<Flex display={isOpen ? "flex" : "none"} position="absolute" onfo justifyContent="center" width="100%" padding={2} borderRadius="lg" right={0} marginTop={2}
        zIndex={100} backgroundColor="white" border="2px solid" borderColor="gray.200">
        {children}
    </Flex>)
}


