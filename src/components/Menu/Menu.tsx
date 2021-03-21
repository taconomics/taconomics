import styles from './Menu.module.scss'
import UserWallet from '../UserWallet';
import { Box, Center, Flex, Image } from '@chakra-ui/react'

export default function Menu({ unifty }) {
    return (<Flex flexDir="row" alignItems="center" fontFamily="Nunito">


        <Logo></Logo>
        <MenuItems></MenuItems>
        {<UserWallet unifty={unifty}></UserWallet>}
    </Flex>)
}

export function Logo() {
    return (<Box flexGrow={.05} ><Center><Image padding="30px" height={100} src="logo.svg"></Image></Center></Box>)
}

function MenuItems() {
    return (<Flex fontFamily="Nunito, sans-serif;" flexGrow={4} justifyContent="space-around" alignItems="center" fontWeight="extrabold" fontSize="md" paddingRight={20}>

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

