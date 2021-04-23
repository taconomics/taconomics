import { useEffect } from "react";
import { useState } from "react";
import { CardTypes } from "../components/Card/Card";
import { TacoProps } from "../components/TacoLayout";
import Unifty from "../uniftyLib/UniftyLib";
import { getCardInfo, ICardInfo, IFarmData, IMetaNft, INft, useCardInfo } from "./useCardInfo";

export interface SearchConfig {
    artist?: string,
    collection?: string,
    rarity?: number,
    price?: number,
    name?: string
    page?: number,
    pageSize: number,
    tacoProps: TacoProps;
}
interface PieceNFT {
    nft: IFarmData,
    metaUri: string
}
export interface SearchResult {
    nfts: PieceNFT[],
    artist: string[],
    collections: any[],
    rarity: any[],
    price: any[],

}
export const useGetPieces = (searchConfig: SearchConfig, changer: number) => {


    const [cachedResults, setCachedResults] = useState<SearchResult>({ nfts: [], artist: [], collections: [], rarity: Object.keys(CardTypes), price: [] });

    const [results, setResult] = useState<SearchResult>(cachedResults);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function func() {
            if (searchConfig.tacoProps != undefined) {
                await searchConfig.tacoProps.unifty.isConnected();
                const res = await getResults(searchConfig);

                setCachedResults(res);
                setLoaded(true);
            }

        }

        func();
    }, [changer])

    useEffect(() => {
        async function func() {
            if (searchConfig.tacoProps != undefined) {
                await searchConfig.tacoProps.unifty.isConnected();
                setResult({ ...cachedResults, nfts: [] })
                let ser = await search(searchConfig, cachedResults,setLoaded);
                setResult(ser);
            }

        }

        func();
    }, [changer, searchConfig, cachedResults])

    console.log("Search config inside", searchConfig)

    return { results, loaded }

}
async function getResults(config: SearchConfig) {
    let result: SearchResult = { nfts: [], artist: [], collections: [], rarity: Object.keys(CardTypes), price: [] };
    let allNfts = await getAllNfts(config.tacoProps.unifty);
    for (const index in allNfts) {
        let nft = allNfts[index]
        let metaNftUri = await config.tacoProps.unifty.getNftMeta(nft.erc1155, nft.id);
        let metaCollection = await config.tacoProps.unifty.getErc1155Meta(nft.erc1155)



        if (!result.artist.includes(nft.artist))
            result.artist.push(nft.artist);

        if (!result.nfts.includes({ nft: nft, metaUri: metaNftUri })) {
            result.nfts.push({ nft: nft, metaUri: metaNftUri });
        }

        let hasCollection = false;
        result.collections.forEach(element => {
            if (element.address === nft.erc1155) {
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
async function search(config: SearchConfig, results: SearchResult,setLoaded:(loaded)=>any) {
    setLoaded(false);
    config.pageSize = config.pageSize ? config.pageSize : 10;
    console.log("page size", config.pageSize)

    await config.tacoProps.unifty.isConnected();
    let newResults: SearchResult = { ...results, nfts: [] };

    for await(let val of results.nfts){
        if(await isValidNft(val,config)){
            newResults.nfts.push(val);
        }
    }

    setLoaded(true);

    console.log("Search", results);

    return newResults;
}

async function isValidNft(nft: PieceNFT, config: SearchConfig): Promise<boolean> {

    const artist = config.artist == nft.nft.artist || !config.artist
    const collection = config.collection == nft.nft.erc1155 || !config.collection
    let name = true;
    if(config.name){
        const cardInfo = await getCardInfo(config.tacoProps, nft.nft.erc1155, nft.nft.id, { useMeta: true })
        name = cardInfo.meta.name.toLowerCase().includes(config.name.toLowerCase())
    }
    
    const rarity = config.rarity == nft.nft.supply || !config.rarity;
    return artist && collection && name && rarity
}

async function getAllNfts(unifty: Unifty) {
    let logs: IFarmData[] = [];
    let queryTacoshi = await unifty.getFarmNfts(unifty.tacoshiFarm);
    let queryRabbit = await unifty.getFarmNfts(unifty.rabbitFarm);

    if (queryRabbit && queryTacoshi)
        logs = [...queryTacoshi, ...queryRabbit]

    return logs;
}