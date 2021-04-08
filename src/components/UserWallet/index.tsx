import { Button, HStack, Menu, MenuButton, Image, MenuList, Box, Flex, useMediaQuery, Link } from "@chakra-ui/react"
import React, { useState } from "react"
import Unifty from "../../uniftyLib/UniftyLib";

const Lemon_Icon = "/icons/Lemon_Icon.svg";
const Chile_Icon = "/icons/Chile_Icon.svg";
const DownArrow_Icon = "/icons/DownArrow_Icon.svg";
const Wallet_Icon = "/icons/Wallet_Icon.svg";
const Taco_Icon = "/icons/Taco_Icon.svg";
const Molcajete_Icon = "/icons/Lemon_Icon.svg";
const Cubiertos_Icon = "/icons/Lemon_Icon.svg";



export default function UserWallet(props: { unifty: Unifty}) {
    const [isConnected, setIsConnected] = useState(false);

    const [isMobile] = useMediaQuery("(max-width: 1024px)")
    let onClickConnect = () => {
        console.log("Requested account");
        props.unifty.getAccount();
    }

    props.unifty.isConnected().then((e) => {
        setIsConnected(e);
        return e;
    })

    return (<Box flexGrow={{md:1,lg:1.3}}>
        {
            !isConnected ?

                <ButtonConnect onClickConnect={onClickConnect}></ButtonConnect>
                :

                <WalletContainer unifty={props.unifty} isMobile={isMobile}></WalletContainer>

        }
    </Box>)
}

function WalletContainer(props: { unifty: Unifty, isMobile }) {
    if (props.isMobile) {
        return <Button>Wallet</Button>
    } else {
        return (
            <Flex width="100%" alignItems="center" justifyContent="space-evenly">

                <Box fontFamily="Nunito" fontWeight="extrabold"><Link href="/manager">Collection manager</Link></Box>
                <Box fontFamily="Nunito" fontWeight="extrabold">My items</Box>
                <Coins unifty={props.unifty}></Coins>
            </Flex>)
    }

}

function Coins({ unifty }) {
    let lemonBalance = 100.01;
    let iconSize = 6;
    let padding = 10;
    return (
        <Menu placement="top-end">
            <MenuButton as={Button} colorScheme="transparent" margin={6}>
                <HStack>
                    <Coin spacing={padding} iconSize={iconSize} balance={lemonBalance} img={Lemon_Icon}></Coin>
                    <Coin spacing={padding} iconSize={iconSize} balance={lemonBalance} img={Chile_Icon}></Coin>
                    <Image marginLeft={30} height={2} src={DownArrow_Icon}></Image>

                </HStack>

            </MenuButton>
            <MenuList borderColor="#D4D4D4" borderWidth="2px" padding="25px" minW="100%">
                <ManageStakeMenu></ManageStakeMenu>
            </MenuList>
        </Menu>

    )
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

function ManageStakeMenu(props) {
    let tacoBalance = 999.99;
    let iconSize = "20px"
    let marginTop = "20px"
    return (<Flex flexDir="column" alignItems="center">
        <Flex marginTop={marginTop}><Coin balance={tacoBalance} iconSize={iconSize} img={Taco_Icon} spacing={0} >Stacked</Coin></Flex>
        <Flex marginTop={marginTop}><Coin balance={tacoBalance} iconSize={iconSize} img={Molcajete_Icon} spacing={0} >Stacked</Coin></Flex>
        <Button marginTop="20px" colorScheme="blackButton"><Image paddingRight={2} height={5} src={Cubiertos_Icon}></Image>Manage Stake</Button>
    </Flex>)
}

