import { useEffect, useState } from "react";
import Unifty from "../../src/uniftyLib/UniftyLib"
import Card from '../../src/components/Card/Card'
import styles from './Collections.module.scss'

export default function Collections(props: { unifty: Unifty }) {
    let collectionAddress = "0x18f42d699Fc56ddd92FFDD2a5EaDBec1a4082Bf5"
    let miFarmEnRinkedy = "0x3b93f48246AE855E3E7001bc338E43C256D7A2dD";

    let [nfts, setNfts] = useState([]);

    useEffect(() => {

        let as = async function () {
            let nfts = await getNftsJson(props.unifty, miFarmEnRinkedy);
            let g = [];

            for(const nft of nfts) {
                const name = Math.floor(Math.random() * 100);
                g.push(<Card key={name} nft={nft}></Card>)
            }
            setNfts(g);
        }
        as();
    }, [])

    return (<div className={styles.content}>
        <div className={styles.title}>All collections</div>
        <div className={styles.collections}>
            {nfts}
        </div>
    </div>)
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

    for await (const nft of farmNfts) {
        let realNft = await unifty.getNft(nft.erc1155, nft.id);
        let metaNft = await unifty.getNftMeta(nft.erc1155, nft.id);
        let jsonMeta = await fetch(metaNft).then(r => r.json())
        nfts.push({ nft: realNft, meta: jsonMeta,info:nft });
    }
    return nfts;


}