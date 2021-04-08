import { Box, Button, Center, Flex, Grid, HStack, Image, Spinner } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { defaultFarms } from '../../../pages/farms';
import Unifty from '../../uniftyLib/UniftyLib';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';


export default function Card(props: { nft: any, unifty: Unifty }) {
    let width = 240;
    let height = 300;
    const nft = props.nft;
    const unifty = props.unifty;

    const [meta, setMeta] = useState({ image: "",name:"",supply:0,maxSupply:0 });
    if (unifty != undefined) {
        useEffect(() => {
            async function func (){
                let realNft = await unifty.getNft(nft.erc1155, nft.id);
                let metaNft = await unifty.getNftMeta(nft.erc1155, nft.id);
                let network = await unifty.getNetwork()
                let farmForSupply = network==1?defaultFarms.tacoshiRabbit:defaultFarms.maniacom;

                let farmNftData = await unifty.farmNftData(farmForSupply,nft.erc1155,nft.id);

                let balanceOf = await unifty.balanceOf(nft.erc1155,farmForSupply,nft.id);
                
                let jsonMeta = await fetch(metaNft).then(r => r.json())
               /* console.log("Balance: ",balanceOf," / collection",jsonMeta.name);
                console.log("realNft",realNft);
                console.log("farmNftData",farmNftData.balance);*/
                setMeta({ image: jsonMeta.image,name:jsonMeta.name,supply:balanceOf ,maxSupply:farmNftData.supply});
            }

            func();

        }, [])
    }
    return (<Grid overflow="hidden" marginLeft={5} marginBottom="25px" templateRows="1fr 1fr" width={width + "px"} backgroundColor="white" height={height + "px"} borderRadius="15px" boxShadow="lg">
        {meta.image==""||nft==undefined?
            <Center><Spinner /></Center> :
            <Flex padding="5px" width={width + "px"} height={height + "px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
               <CardTypeBadge></CardTypeBadge>
                <Image  maxHeight={height / 3.4 + "px"} src={meta.image}></Image>
                <Box fontSize="large" fontWeight="bold">
                   {meta.name}
                </Box>
                <HStack>
                    <Box><Coin spacing={0} iconSize="30px" balance={99.9} img={"/icons/Lemon_Icon.svg"}></Coin></Box>
                    <CardAvailable supply={meta.supply} maxSupply={meta.maxSupply}></CardAvailable>
                </HStack>
                <Box><b>0.1</b> to mint</Box>
                <Button>Connect to wallet</Button>

            </Flex>
        }
        {nft == undefined ?
            <Center><Spinner /></Center> :
            <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={height / 2.3 + "px"}>
                <Image src={meta.image}></Image>
            </Box>}
    </Grid>)
}

function CardAvailable(props:{supply,maxSupply}){
return <HStack><Box fontWeight="bold">{props.supply+"/"+props.maxSupply}</Box> <Box>Available</Box></HStack>
}

function CardTypeBadge(props){
    return (<Flex flexDirection="row" backgroundColor="white" borderRadius="md" padding="5px" color="#41b4e6" fontWeight="extrabold">
        <Image marginRight={1} src="/icons/Diamante_Icon.svg"></Image>
        <Box fontSize="small">RARE</Box>
        </Flex>)
}