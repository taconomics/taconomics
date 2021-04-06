import { Box, Button, Center, Flex, HStack, Link, LinkBox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Card from "../../src/components/Card/Card";
import Unifty from "../../src/uniftyLib/UniftyLib";
import { getNftsJson } from "./[farm]";

export const defaultFarms = {
    tacoshiFarm: "0xe567c8eE1C362C6CfCb217e43aCfd0F68dC456F2",
    tacoshiRabbit: "0xA6fBbE582D41c6ebbb4ad5803793dcce8662C910",
    maniacom: "0x3b93f48246AE855E3E7001bc338E43C256D7A2dD"
}

export default function FarmIndex(props) {

    const goToFarm = (e) => {
        console.log(e.target.name);
    }

    return (<Center flexDir="column">
        <Box>
            ¿Which farm do you want to go?
        </Box>

        <HStack>
            <LinkToFarm address={defaultFarms.tacoshiFarm}>Tacoshi's Farm</LinkToFarm>
            <LinkToFarm address={defaultFarms.tacoshiRabbit}>Tacoshi's Rabbit Quest</LinkToFarm>
            <LinkToFarm address={defaultFarms.maniacom}>(Rinkeby) Mania.com</LinkToFarm>
        </HStack>
    </Center>)
}

export function RecentNfts(props: { unifty: Unifty, itemsSize }) {
    const [nfts, setNfts] = useState(undefined);

    useEffect(() => {


        const func = async () => {
            let tacoshi = await getNftsJson(props.unifty, defaultFarms.tacoshiFarm);
            let rabbit = await getNftsJson(props.unifty, defaultFarms.tacoshiRabbit);
            let one = true;

            let tacoshiCount = 0;
            let rabbitCount = 0;

            let finalArray = [];
            for(let a =0;a<props.itemsSize;a++){

                    const name = Math.floor(Math.random() * 100);
                    let nft = one?tacoshi[tacoshiCount]:rabbit[rabbitCount];
                    let card = <Card key={name} nft={nft}></Card>;
                    finalArray.push(card)
                    if(one){
                        tacoshiCount++;
                    }else{
                        rabbitCount++;
                    }
                    one!=one;

                
            }

            setNfts(finalArray);
            console.log(tacoshi.length);
        }
        func();
    }, [])

    return (<Box>Recent Nfts
        <Flex flexWrap="wrap">{nfts}</Flex>
        </Box>)
}

const LinkToFarm = ({ children, address }) => {
    return <Link href={"/farms/" + address}>{children}</Link>
}