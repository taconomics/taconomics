import { useEffect } from "react";
import { useState } from "react";
import { CardTypes } from "../components/Card/Card";
import Unifty from "../uniftyLib/UniftyLib";

export interface SearchConfig {
    artist?: string,
    collection?: string,
    rarity?: number,
    price?: number,
    pageSize: number,
    page?: number
    unifty: Unifty;
}
export interface SearchResult {
    nfts: any[],
    artist: string[],
    collections: any[],
    rarity: any[],
    price: any[],

}
export const useGetPieces = (searchConfig: SearchConfig, changer: number) => {

    
    const [cachedResults,setCachedResults] = useState<SearchResult>({ nfts: [], artist: [], collections: [], rarity: Object.keys(CardTypes), price: [] });

    const [results, setResult] = useState<SearchResult>(cachedResults);
    const [loaded,setLoaded] = useState(false);

    useEffect(() => {
        async function func() {
            if (searchConfig.unifty != undefined) {
                await searchConfig.unifty.isConnected();
                const res = await getResults(searchConfig);

                setCachedResults(res);
                setLoaded(true);
            }

        }

        func();
    }, [changer])

    useEffect(() => {
        async function func() {
            if (searchConfig.unifty != undefined) {
                await searchConfig.unifty.isConnected();
                setResult({...cachedResults,nfts:[]})
                let ser = await search(searchConfig, cachedResults);
                setResult(ser);
            }

        }

        func();
    }, [changer,searchConfig,cachedResults])

    console.log("Search config inside",searchConfig)

    return { results,loaded }

}
async function getResults(config: SearchConfig) {
    let result: SearchResult = { nfts: [], artist: [], collections: [], rarity: Object.keys(CardTypes), price: [] };
    let allNfts = await getAllNfts(config.unifty);
    for (const index in allNfts) {
        let nft = allNfts[index]
        let metaNft = await config.unifty.getNftMeta(nft.erc1155, nft.id);
        let metaCollection = await config.unifty.getErc1155Meta(nft.erc1155);


        if (!result.artist.includes(nft.artist))
            result.artist.push(nft.artist);

        if (!result.nfts.includes(metaNft)) {
            // let real =await  config.unifty.readUri(metaNft)
            result.nfts.push({ nft: nft, meta: metaNft });
        }

        let hasCollection = false;
        result.collections.forEach(element => {
            if (element.address === nft.erc1155){
                hasCollection = true;
            }
        });
        if (!hasCollection) {
            //let real =await  config.unifty.readUri(metaCollection.contractURI)
            result.collections.push({ address: nft.erc1155, meta: metaCollection });
        }
    }
    return result;
}
async function search(config: SearchConfig, results: SearchResult) {
    config.pageSize = config.pageSize ? config.pageSize : 10;
    console.log("page size", config.pageSize)

    await config.unifty.isConnected();
    let newResults: SearchResult = { ...results, nfts: [] };


    results.nfts.forEach((val) => {
        //Check artist
        console.log("new results", val);
        if (isValidNft(val, config)) {
            newResults.nfts.push(val);
        }
    })

    console.log("Search", results);

    return newResults;
}

function isValidNft(nft, config: SearchConfig): boolean {
    const artist = config.artist == nft.nft.artist || !config.artist
    const collection  = config.collection == nft.nft.erc1155 || !config.collection
    console.log("collection",config,"nft",nft)
    const rarity = config.rarity == nft.nft.supply || !config.rarity;
    return artist && collection
}

async function getAllNfts(unifty: Unifty) {
    let logs = [];
    let queryTacoshi = await unifty.getFarmNfts(unifty.tacoshiFarm);
    let queryRabbit = await unifty.getFarmNfts(unifty.rabbitFarm);

    if (queryRabbit && queryTacoshi)
        logs = [...queryTacoshi, ...queryRabbit]

    return logs;
}