import styles from './Menu.module.scss'
import UserWallet from '../UserWallet';
import { Box, Button, Center, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Input, Link, LinkBox, LinkOverlay, useDisclosure, useMediaQuery, useStyleConfig } from '@chakra-ui/react'
import Image from 'next/image';
import React from 'react';
import NextLink from "next/link"
//import img from "./"

export default function Menu({ unifty }) {

    const [isMobile] = useMediaQuery("(max-width: 768px)")

    return (<Flex flexDir="row" alignItems="center" justifyContent="space-between" fontFamily="Nunito">
        {isMobile && <MenuItemsMobile></MenuItemsMobile>}
        <Logo></Logo>
        {!isMobile && <MenuItems></MenuItems>}
        {<UserWallet unifty={unifty}></UserWallet>}
    </Flex>)
}

export function Logo() {
    return (<LinkBox minWidth="60px">
        <NextLink href="/" passHref>
            <LinkOverlay><Image src="/Logo.svg" layout="intrinsic" width={80} height={80}></Image>
            </LinkOverlay>
        </NextLink></LinkBox>)
}

export function MenuItemsMobile() {
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
                    <DrawerHeader>Create your account</DrawerHeader>

                    <DrawerBody>
                        <Input placeholder="Type here..." />
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="blue">Save</Button>
                    </DrawerFooter>
                </DrawerContent>
            </DrawerOverlay>
        </Drawer>
    </>
}

export function MenuItems(props: { variant?}) {
    const { variant, ...rest } = props

    const styles = useStyleConfig("MenuItems", { variant })

    return (<Flex fontFamily="Nunito, sans-serif;" flexGrow={4} textAlign="center" justifyContent="space-around" variant={"footer"} alignItems="center" sx={styles} fontSize="md" paddingRight={20}>

        <MenuItem><NextLink href="/collections">Collections</NextLink></MenuItem>
        <MenuItem><NextLink href="/available-pieces">Available pieces</NextLink></MenuItem>
        <MenuItem>Buy TACO</MenuItem>
        <MenuItem><NextLink href="/sell-your-art">Sell your art</NextLink></MenuItem>
        <MenuItem>About us</MenuItem>



    </Flex>)
}
function MenuItem(props) {
    return (<Box margin={1} cursor="pointer">{props.children}</Box>)
}


