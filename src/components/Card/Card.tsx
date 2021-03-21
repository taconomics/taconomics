import { Box, Button, Flex, Grid , Image} from '@chakra-ui/react';
import React from 'react';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';


export default function Card({nft}){
    let width = 300;
    let height = 400;
    return (<Grid margin="20px" overflow="hidden" templateRows="1fr 1fr" width={width + "px"}  backgroundColor="white" height={height + "px"} borderRadius="15px" boxShadow="lg">
       

        <Flex padding="10px" width={width+"px"} height={height+"px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
            <Box backgroundColor="white" borderRadius="3px" padding="2px" color="#41b4e6" fontWeight="extrabold">RARE</Box>
            <Image marginTop="30px" marginBottom="30px" maxHeight="150px" src={nft.meta.image}></Image>
            <Box>
                <Box><Coin spacing={0} iconSize="30px" balance={99.9} img={"icons/Lemon_Icon.svg"}></Coin> <Box><b>9/10</b> Available</Box></Box>
            </Box>
            <Box><b>0.1</b> to mint</Box>
            <Button>Connect to wallet</Button>
            
        </Flex>

        <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={height/2.3+"px"}><Image  src={nft.meta.image}></Image></Box>
    </Grid>)
}