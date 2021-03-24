import styles from './Menu.module.scss'
import UserWallet from '../UserWallet';
import { Box, Center, Flex, useStyleConfig } from '@chakra-ui/react'
import Image from 'next/image';
//import img from "./"

export default function Menu({ unifty }) {
    return (<Flex flexDir="row" alignItems="center" fontFamily="Nunito">


        <Logo></Logo>
        <MenuItems></MenuItems>
        {<UserWallet unifty={unifty}></UserWallet>}
    </Flex>)
}

export function Logo() {
    return (<Box minWidth="60px"><Image src="/Logo.svg" layout="intrinsic" width={80} height={80}></Image></Box>)
}

export function MenuItems(props:{variant?}) {
    const { variant, ...rest } = props
    const styles = useStyleConfig("MenuItems",{variant})
    console.log(props.variant)
    return (<Flex fontFamily="Nunito, sans-serif;" flexGrow={4} justifyContent="space-around" variant={"footer"} alignItems="center" sx={styles} fontSize="md" paddingRight={20}>

        <MenuItem>Collections</MenuItem>
        <MenuItem>Available pieces</MenuItem>
        <MenuItem>Buy TACO</MenuItem>
        <MenuItem>Sell your art</MenuItem>
        <MenuItem>About us</MenuItem>



    </Flex>)
}
function MenuItem(props) {
    return (<Box margin={1} cursor="pointer">{props.children}</Box>)
}


