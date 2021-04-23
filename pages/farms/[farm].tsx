import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Unifty from "../../src/uniftyLib/UniftyLib"
import Card from '../../src/components/Card/Card'
import styles from './Collections.module.scss'
import { Box, Flex } from "@chakra-ui/react";
import { TacoProps } from "../../src/components/TacoLayout";

export default function Farm(props:TacoProps) {
    const router = useRouter();
    const farm = router.query.farm as string;

    let [nfts, setNfts] = useState([]);

    useEffect(() => {

        let as = async function () {
            if (farm != undefined) {
                let nfts = await getNftsJson(props.unifty, farm);
                let g = [];

                for (const nft of nfts) {
                    const name = Math.floor(Math.random() * 100);
                    g.push(<Card tacoProps={props} key={name} nft={nft}></Card>)
                }
                console.log("nfts", nfts);
                setNfts(g);
            }

        }
        as();
    }, [farm])

    return (<Box>
        <Box>Farm {farm}</Box>
        <Flex flexWrap="wrap" justifyContent="center">
            {nfts}
        </Flex>
    </Box>)
}


/**
 * Get all NFTS from farm
 * @param {Unifty} unifty
 * @param {String} farmAddress
 * @returns {Promise} Nfts
 */
export async function getNftsJson(unifty: Unifty, farmAddress: string) {
    let farmNfts = await unifty.getFarmNfts(farmAddress);
    console.log("GetNftsJson",farmNfts)
    return farmNfts;


}