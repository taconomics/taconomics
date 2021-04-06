import { Box, Button, Center, HStack, Link, LinkBox } from "@chakra-ui/react";
import React from "react";

export const defaultFarms = {tacoshiFarm:"0xe567c8eE1C362C6CfCb217e43aCfd0F68dC456F2",
tacoshiRabbit:"0xA6fBbE582D41c6ebbb4ad5803793dcce8662C910",
maniacom:"0x3b93f48246AE855E3E7001bc338E43C256D7A2dD"
}

export default function FarmIndex(props){

    const goToFarm = (e)=>{
        console.log(e.target.name);
    }

    return(<Center flexDir="column">
        <Box>
            ¿Which farm do you want to go?
        </Box>
        
        <HStack>
            <LinkToFarm address={defaultFarms.tacoshiFarm}>Tacoshi's Farm</LinkToFarm>
            <LinkToFarm address={defaultFarms.tacoshiRabbit}>Tacoshi's Rabbit Quest</LinkToFarm>
            <LinkToFarm address={defaultFarms.tacoshiRabbit}>(Rinkeby) Mania.com</LinkToFarm>
        </HStack>
    </Center>)
}

const LinkToFarm = ({children,address})=>{
    console.log(address)
   return <Link href={"/farm/"+address}>{children}</Link>
}