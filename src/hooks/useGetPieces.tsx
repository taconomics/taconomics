import { useInterval } from "@chakra-ui/react";
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
    artist: string[],
    collections: any[],
    rarity: any[],
    price: any[],

}
export const useGetPieces = (searchConfig: SearchConfig) => {

    const emptyResult = { artist: [], collections: [], rarity: Object.keys(CardTypes), price: [] }
    const [cachedResults, setCachedResults] = useState<SearchResult>(emptyResult);

    const [results, setResult] = useState<SearchResult>(cachedResults);
    const [loaded, setLoaded] = useState(false);


    //const [nfts, setNfts] = useState<PieceNFT[]>([])

    const nfts = useAsyncNfts(searchConfig,setLoaded);

    return { results, loaded, nfts }

}

function useAsyncNfts(config: SearchConfig,setLoaded:(v:boolean)=>any) {
    const [nfts, setNfts] = useState<PieceNFT[]>([])
    const [currentBlock, setBlock] = useState(0);
    const range = 50000;
    console.log("Search fondig",config.name)
    useEffect(() => {
        setNfts([])
        async function func() {
            setBlock(await config.tacoProps.unifty.web3.eth.getBlockNumber())
        }
        func();
    }, [config.tacoProps.changer,config.name])


    console.log(config)
    const time = currentBlock<=0||nfts.length==config.pageSize?null:100;

    useEffect(()=>{
        setLoaded(config.pageSize==nfts.length)
    },[nfts,config.tacoProps.changer])

    useInterval(async() => {
        
        let queryTacoshi = await config.tacoProps.unifty.getFarmNftsToBlock(config.tacoProps.unifty.tacoshiFarm, currentBlock - range, currentBlock)
        const newNfts:PieceNFT[] =[]
        for(let nft of queryTacoshi){
            let metaNftUri = await config.tacoProps.unifty.getNftMeta(nft.erc1155, nft.id);
            if(nfts.length+newNfts.length+1<=config.pageSize){
                const newF = { nft: nft, metaUri: metaNftUri }
                if(isValidNft(newF,config)){
                    newNfts.push(newF);
                }
                
            }
             
        }
         setNfts([...nfts,...newNfts])

         setBlock(currentBlock-range)

    }, time);


    return nfts;

}

async function search(config: SearchConfig, results: SearchResult, setLoaded: (loaded) => any, nfts: PieceNFT[]) {
    setLoaded(false);
    config.pageSize = config.pageSize ? config.pageSize : 10;
    console.log("page size", config.pageSize)

    await config.tacoProps.unifty.isConnected();
    let newResults: PieceNFT[] = { ...nfts };

    for await (let val of nfts) {
        if (await isValidNft(val, config)) {
            newResults.push(val);
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
    let rarity = true;
    if (config.name || config.rarity) {
        const cardInfo = await getCardInfo(config.tacoProps, nft.nft.erc1155, nft.nft.id, { useMeta: true, useFarmData: true, useExtras: true })

        if (config.name) {
            name = cardInfo.meta.name.toLowerCase().includes(config.name.toLowerCase())
        }
        if (config.rarity) {
            rarity = "" + config.rarity == cardInfo.extras.balanceOf || !config.rarity;
        }
    }


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

async function getAsyncNfts(tacoProps: TacoProps, config: SearchConfig, addNft) {


    await tacoProps.unifty.isConnected();
    let latestBlock = await tacoProps.unifty.web3.eth.getBlockNumber();
    let range = 1000000;
    let currentBlock = latestBlock;
    let nfts: PieceNFT[] = []



    while (currentBlock > 0) {

        currentBlock = currentBlock > 0 ? currentBlock : 0

        let queryTacoshi = await tacoProps.unifty.getFarmNftsToBlock(tacoProps.unifty.tacoshiFarm, currentBlock - range, currentBlock)
        //let queryRabbit = await tacoProps.unifty.getFarmNftsToBlock(tacoProps.unifty.rabbitFarm, currentBlock - range, currentBlock)

        if (queryTacoshi) {
            if (queryTacoshi.length > 0) {
                for await (let nft of queryTacoshi) {
                    //let metaNftUri = await config.tacoProps.unifty.getNftMeta(nft.erc1155, nft.id);

                    nfts.push({ nft: nft, metaUri: "metaNftUri" });

                    addNft({ nft: nft, metaUri: "metaNftUri" })

                }

            }
        }
        currentBlock -= range;
        console.log("Block", currentBlock)
    }

}

async function addResults(config: SearchConfig, nfts: PieceNFT[], results: SearchResult) {
    //let result: SearchResult = { nfts: [...results.nfts], artist: [...results.artist], collections: [...results.collections], rarity: Object.keys(CardTypes), price: [] };
    let result: SearchResult = { ...results };
    for (const index of nfts) {
        let nft = index
        let metaCollection = await config.tacoProps.unifty.getErc1155Meta(nft.nft.erc1155)
        if (!result.artist.includes(nft.nft.artist)) {
            result.artist.push(nft.nft.artist);
        }
        // result.nfts.push(nft);


        let hasCollection = false;
        result.collections.forEach(element => {
            if (element.address === nft.nft.erc1155) {
                hasCollection = true;
            }
        });
        if (!hasCollection) {
            //let real =await  config.unifty.readUri(metaCollection.contractURI)
            result.collections.push({ address: nft.nft.erc1155, meta: metaCollection });
        }
    }
    return result;
    // setCachedResults(result);
}