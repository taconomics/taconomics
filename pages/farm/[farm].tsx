import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import Unifty from "../../src/uniftyLib/UniftyLib"
import Card from '../../src/components/Card/Card'
import styles from './Collections.module.scss'
import { Box, Flex } from "@chakra-ui/react";

export default function Collections(props: { unifty: Unifty }) {
    const router = useRouter();
    const farm = router.query.farm as string;
    console.log("Collection", farm)

    let [nfts, setNfts] = useState([]);

    useEffect(() => {

        let as = async function () {
            if (farm != undefined) {
                let nfts = await getNftsJson(props.unifty, farm);
                let g = [];

                for (const nft of nfts) {
                    const name = Math.floor(Math.random() * 100);
                    g.push(<Card key={name} nft={nft}></Card>)
                }
                console.log("nfts", nfts);
                setNfts(g);
            }

        }
        as();
    }, [farm])

    return (<Box>
        <Box>Farm {farm}</Box>
        <Flex flexWrap="wrap" maxWidth="100vw">
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
async function getNftsJson(unifty: Unifty, farmAddress: string) {
    let farmNfts = await unifty.getFarmNfts(farmAddress);
    var nfts = [];

    console.log(farmNfts);

      for await (const nft of farmNfts) {
          let realNft = await unifty.getNft(nft.erc1155, nft.id);
          let metaNft = await unifty.getNftMeta(nft.erc1155, nft.id);
          let jsonMeta = await fetch(metaNft).then(r => r.json())
          nfts.push({ nft: realNft, meta: jsonMeta,info:nft });
      }
    return nfts;


}