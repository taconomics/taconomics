import styles from './Menu.module.scss'
import UserWallet from '../UserWallet';
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, HStack, Input, Link, LinkBox, LinkOverlay, propNames, useDisclosure, useMediaQuery, useStyleConfig } from '@chakra-ui/react'
import Image from 'next/image';
import React from 'react';
import NextLink from "next/link"
import { TacoProps } from '../TacoLayout';
//import img from "./"

export default function Menu(props:TacoProps) {

    const [isMobile] = useMediaQuery("(max-width: 768px)")

    return (<Flex flexDir="row" w="100%" alignItems="center" justifyContent="space-between" fontFamily="Nunito">
        {isMobile && <MenuItemsMobile taco={props}></MenuItemsMobile>}
        <Logo></Logo>
        {!isMobile && <MenuItems></MenuItems>}
        {!isMobile&&<UserWallet changer={props.changer} unifty={props.unifty}></UserWallet>}
    </Flex>)
}

export enum LogoVariants {
    WHITE = "_White",
    NONE = ""
}
export function Logo(props: { variant?: LogoVariants }) {
    let variant = props.variant ? props.variant : LogoVariants.NONE;
    return (<LinkBox minWidth="60px">
        <NextLink href="/" passHref>
            <LinkOverlay><Image src={"/Logo" + variant + ".svg"} layout="intrinsic" width={80} height={80}></Image>
            </LinkOverlay>
        </NextLink></LinkBox>)
}

export function MenuItemsMobile(props:{taco:TacoProps}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()
    return <><Button onClick={onOpen}><Image src="/icons/Burger.svg" layout="intrinsic" width={20} height={20} /></Button>
        <Drawer
            isOpen={isOpen}
            placement="left"
            onClose={onClose}
            finalFocusRef={btnRef}
        >
            <DrawerOverlay>
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <HStack alignItems="center" justifyContent="center" width="100%">
                            <Logo></Logo>
                        </HStack>
                    </DrawerHeader>

                    <DrawerBody>
                    <Box fontSize="xl" color="gray.700">Menu</Box>
                        <MenuItems variant="drawer"></MenuItems>
                        <Box fontSize="xl" color="gray.700" marginTop={5}>User wallet</Box>
                        <UserWallet unifty={props.taco.unifty} changer={props.taco.changer}></UserWallet>
                    </DrawerBody>

                    <DrawerFooter>
                        <HStack>
                            <Box fontWeight="bold" color="gray.400">Taconomics 1.0</Box>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    </>
}

export function MenuItems(props: { variant?}) {
    const { variant, ...rest } = props

    const styles = useStyleConfig("MenuItems", { variant })

    return (<Flex fontFamily="Nunito, sans-serif;" flexGrow={4} textAlign="center"
        flexDir={["column", "column", "row"]}
        justifyContent="space-around" variant={props.variant}
        alignItems={variant == "drawer" ? "start" : "center"} sx={styles} fontSize="md"
    >

        <MenuItem><NextLink href="/collections">Collections</NextLink></MenuItem>
        <MenuItem><NextLink href="/available-pieces">Available pieces</NextLink></MenuItem>
        <MenuItem><NextLink href="/buy-taco">Buy TACO</NextLink></MenuItem>
        <MenuItem><NextLink href="/sell-your-art">Sell your art</NextLink></MenuItem>
        <MenuItem><NextLink href="/about">About us</NextLink></MenuItem>
        {variant == "footer" && <MenuItem><NextLink href="/privacy">Privacy Policy</NextLink></MenuItem>}



    </Flex>)
}
function MenuItem(props) {
    return (<Box margin={1} cursor="pointer">{props.children}</Box>)
}


