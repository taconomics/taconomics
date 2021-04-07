import { Box, Button, Center, Flex, Grid, Image, Spinner } from '@chakra-ui/react';
import React from 'react';
import { Coin } from '../UserWallet';
import styles from './Card.module.scss';


export default function Card({ nft }) {
    let width = 240;
    let height = 300;
    return (<Grid overflow="hidden" marginLeft={5} marginBottom="25px" templateRows="1fr 1fr" width={width + "px"} backgroundColor="white" height={height + "px"} borderRadius="15px" boxShadow="lg">
        {nft==undefined?
        <Center><Spinner /></Center>:
        <Flex padding="5px" width={width + "px"} height={height + "px"} justifyContent="space-between" flexDirection="column" alignItems="center" gridRow="1/2" zIndex="101" gridColumn="1/1">
            <Box backgroundColor="white" borderRadius="3px" padding="2px" color="#41b4e6" fontWeight="extrabold">RARE</Box>
            <Image marginTop="30px" marginBottom="30px" maxHeight={height / 3.4 + "px"} src={nft.meta.image}></Image>
            <Box>
                <Box><Coin spacing={0} iconSize="30px" balance={99.9} img={"icons/Lemon_Icon.svg"}></Coin> <Box><b>9/10</b> Available</Box></Box>
            </Box>
            <Box><b>0.1</b> to mint</Box>
            <Button>Connect to wallet</Button>

        </Flex>
        }
        {nft==undefined?
        <Center><Spinner /></Center>:
        <Box gridRow="1/1" margin="20px" gridColumn="1/1" zIndex="100" overflow="hidden" filter="blur(4px)" height={height / 2.3 + "px"}>
            <Image src={nft.meta.image}></Image>
        </Box>}
    </Grid>)
}