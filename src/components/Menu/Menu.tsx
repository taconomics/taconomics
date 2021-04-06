import styles from './Menu.module.scss'
import UserWallet from '../UserWallet';
import { Box, Center, Flex, Link, useStyleConfig } from '@chakra-ui/react'
import Image from 'next/image';
import React from 'react';
//import img from "./"

export default function Menu({ unifty }) {
    return (<Flex flexDir="row" alignItems="center" fontFamily="Nunito">
        <Logo></Logo>
        <MenuItems></MenuItems>
        {<UserWallet unifty={unifty}></UserWallet>}
    </Flex>)
}

export function Logo() {
    return (<Box minWidth="60px"><Link href="/"><Image src="/Logo.svg" layout="intrinsic" width={80} height={80}></Image></Link></Box>)
}

export function MenuItems(props:{variant?}) {
    const { variant, ...rest } = props
    const styles = useStyleConfig("MenuItems",{variant})

    return (<Flex fontFamily="Nunito, sans-serif;" flexGrow={4} justifyContent="space-around" variant={"footer"} alignItems="center" sx={styles} fontSize="md" paddingRight={20}>

        <MenuItem><Link href="/collections">Collections</Link></MenuItem>
        <MenuItem><Link href="/art">Available pieces</Link></MenuItem>
        <MenuItem>Buy TACO</MenuItem>
        <MenuItem>Sell your art</MenuItem>
        <MenuItem>About us</MenuItem>



    </Flex>)
}
function MenuItem(props) {
    return (<Box margin={1} cursor="pointer">{props.children}</Box>)
}


