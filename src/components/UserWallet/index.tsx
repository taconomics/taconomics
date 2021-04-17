import { Button, HStack, Menu, MenuButton, Image, MenuList, Box, Flex, useMediaQuery, Link, useDisclosure, useInterval, Input, MenuItem } from "@chakra-ui/react"
import React, { useRef, useState } from "react"
import { useEffect } from "react";
import Unifty from "../../uniftyLib/UniftyLib";
import NextLink from 'next/link'
import ManageStake from "../ManageStake";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";


const Lemon_Icon = "/icons/Lemon_Icon.svg";
const Chile_Icon = "/icons/Chile_Icon.svg";
const DownArrow_Icon = "/icons/DownArrow_Icon.svg";
const Wallet_Icon = "/icons/Wallet_Icon.svg";
const Taco_Icon = "/icons/Taco_Icon.svg";
const Molcajete_Icon = "/icons/Molcajete_Icon.svg";
const Cubiertos_Icon = "/icons/Cubiertos_Icon.svg";



export default function UserWallet(props: { unifty: Unifty }) {
    const [isConnected, setIsConnected] = useState(false);

    const [isMobile] = useMediaQuery("(max-width: 1024px)")
    let onClickConnect = () => {
        console.log("Requested account");
        props.unifty.getAccount();
    }

    useEffect(() => {
        async function con() {
            let connected = await props.unifty.isConnected();
            setIsConnected(connected);
        }
        con();
    }, [])


    return (<Box flexGrow={{ md: 1, lg: 1.3 }}>
        {
            !isConnected ?

                <ButtonConnect onClickConnect={onClickConnect}></ButtonConnect>
                :

                <WalletContainer unifty={props.unifty} isMobile={isMobile}></WalletContainer>

        }
    </Box>)
}

function WalletContainer(props: { unifty: Unifty, isMobile }) {

    return (
        <Flex width={["auto", "auto", "100%"]} flexDir="row" alignItems="center" justifyContent={["end", "end", "space-between"]}>
            {
                props.isMobile ?
                    <Button>Wallet</Button> :
                    <>
                        <Box fontFamily="Nunito" fontWeight="extrabold"><NextLink href="/collections/manager">Collection manager</NextLink></Box>
                        <Box fontFamily="Nunito" fontWeight="extrabold">My items</Box>
                        <Coins unifty={props.unifty}></Coins>
                    </>

            }

        </Flex>)


}

function Coins(props: { unifty: Unifty }) {
    const [chilesBalance, setChiles] = useState(0);
    const [lemonBalance, setLemons] = useState(0);

    async function func() {
        let connected = await props.unifty.isConnected();
        let chilesPoints = await props.unifty.farmPointsEarned(props.unifty.rabbitFarm, props.unifty.account);
        let lemonPoints = await props.unifty.farmPointsEarned(props.unifty.tacoshiFarm, props.unifty.account);
        setChiles(Math.ceil(chilesPoints));
        setLemons(Math.ceil(lemonPoints));
    }

    useInterval(func, 1000);
    func();


    let iconSize = 6;
    let padding = 10;
    /*return (
        <Menu placement="top-end" >
            <MenuButton as={Button} colorScheme="transparent" margin={0}>
                <HStack>
                    <Coin spacing={padding} iconSize={iconSize} balance={lemonBalance} img={Lemon_Icon}></Coin>
                    <Coin spacing={padding} iconSize={iconSize} balance={chilesBalance} img={Chile_Icon}></Coin>
                    <Image marginLeft={30} height={2} src={DownArrow_Icon}></Image>

                </HStack>

            </MenuButton>
            <MenuList borderColor="#D4D4D4" borderWidth="2px" padding="25px" minW="100%">
                <MenuItem><ManageStakeMenu unifty={props.unifty}></ManageStakeMenu></MenuItem>
            </MenuList>
        </Menu>

    )*/
    return (<TacoButtonBox lemonBalance={lemonBalance} chilesBalance={chilesBalance}>
        <ManageStakeMenu unifty={props.unifty} />
    </TacoButtonBox>)
}


export function Coin({ iconSize, img, balance, spacing, children = undefined }) {
    return (<HStack paddingLeft={spacing}><Image height={iconSize} src={img}></Image>
        <Box color="black" marginLeft={3} fontWeight="extrabold">{balance}</Box>
        <Box>{children}</Box>
    </HStack>)
}


function ButtonConnect({ onClickConnect }) {
    return (<Button onClick={onClickConnect} colorScheme="blackButton" leftIcon={<Image width="20px" src={Wallet_Icon} />}>Connect wallet</Button>)
}

function ManageStakeMenu(props: { unifty: Unifty }) {
    const [taco, setTaco] = useState(0);
    const [salsa, setSalsa] = useState(0);
    const { isOpen, onOpen, onClose } = useDisclosure()
    useEffect(() => {
        async function name() {
            let tacoStake = await props.unifty.farmBalanceOf(props.unifty.rabbitFarm, props.unifty.account)
            let salsaStake = await props.unifty.farmBalanceOf(props.unifty.tacoshiFarm, props.unifty.account)

            setTaco(tacoStake);
            setSalsa(salsaStake);

        }
        name();
    }, [])
    let iconSize = "20px"
    let marginTop = "20px"
    return (<Flex flexDir="column" alignItems="center">
        <Flex marginTop={marginTop}><Coin balance={taco} iconSize={iconSize} img={Taco_Icon} spacing={0} >Stacked</Coin></Flex>
        <Flex marginTop={marginTop}><Coin balance={salsa} iconSize={iconSize} img={Molcajete_Icon} spacing={0} >Stacked</Coin></Flex>
        <Button marginTop="20px" onClick={onOpen} colorScheme="blackButton"><Image paddingRight={2} height={5} src={Cubiertos_Icon}></Image>Manage Stake</Button>
        <ManageStake unifty={props.unifty} isOpen={isOpen} onClose={onClose} onOpen={onOpen}></ManageStake>
    </Flex>)
}

/////////////////////////

function TacoButtonBox({ lemonBalance, chilesBalance, children }) {
    let iconSize = 6;
    let padding = 10;
    const [isOpen,setOpen] = useState(true);
    const wrapperRef = useRef(null);
    
    useOutsideAlerter(wrapperRef,setOpen);

    console.log("Is open",isOpen)

    return <Box position="relative" ref={wrapperRef}>
        <Button as={Button} colorScheme="transparent" onClick={()=>{setOpen(!isOpen)}} margin={0}>
            <HStack>
                <Coin spacing={padding} iconSize={iconSize} balance={lemonBalance} img={Lemon_Icon}></Coin>
                <Coin spacing={padding} iconSize={iconSize} balance={chilesBalance} img={Chile_Icon}></Coin>
                <Image marginLeft={30} height={2} src={DownArrow_Icon}></Image>

            </HStack>
        </Button>
        {<TacoButtonBoxItem setOpen={setOpen} isOpen={isOpen}>{children}</TacoButtonBoxItem>}
    </Box>
}

function TacoButtonBoxItem({ children,setOpen,isOpen }) {
    return (<Flex display={isOpen?"flex":"none"} position="absolute" onfo justifyContent="center" width="100%" padding={2} borderRadius="lg" right={0} marginTop={2}
        zIndex={100} backgroundColor="white" border="2px solid gray">
        {children}
    </Flex>)
}


