
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { CardTypes, getCardType } from "../components/Card/Card";
import { TacoProps } from "../components/TacoLayout";
import Unifty from "../uniftyLib/UniftyLib";
import { getCardInfo, ICardInfo, IFarmData, IMetaNft, INft, useCardInfo } from "./useCardInfo";
import useInterval from "./useInterval";
import { useWalletChanger } from "./useWalletChange";

export interface SearchConfig {
    artist?: string,
    collection?: string,
    rarity?: string,
    price?: number,
    name?: string
    page?: number,
    nextCount: number,
    minimumNfts: number,
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

    const [results, setResult] = useState<SearchResult>(emptyResult);
   

    const changer = useWalletChanger(searchConfig.tacoProps.unifty);

    const [queryNfts, setQueryNfts] = useState<PieceNFT[]>([])
    const isLooking = searchConfig.artist||searchConfig.collection||searchConfig.name||searchConfig.price||searchConfig.rarity
    const { nfts, loaded } = useAsyncNfts(searchConfig,()=>!isLooking?false:true);
    const [queryLoaded, setQueryLoaded] = useState(true);


    //const [nfts, setNfts] = useState<PieceNFT[]>([])

  /*  useEffect(() => {
        setResult(emptyResult)
    }, [changer])*/
    useEffect(() => {
        async function n(){
            let newResult = {...emptyResult}/*results ? { ...results } : { ...emptyResult }*/;
            for (let nft of nfts){
                // const CardInfo =await getCardInfo(searchConfig.tacoProps,nft.nft.erc1155,nft.nft.id,{useMeta:true})
                if (!newResult.artist.includes(nft.nft.artist)) {
                    newResult.artist.push(nft.nft.artist);
                }
                //let addCollection = true;
                let erc1155Meta = await searchConfig.tacoProps.unifty.getErc1155Meta(nft.nft.erc1155);
                var exists = Object.keys(newResult.collections).some(function(k) {
                    return newResult.collections[k].meta.name === erc1155Meta.name;
                })
                if(!exists){
                    newResult.collections.push({ nft: nft.nft, meta: erc1155Meta });
                }
           
            }
    
            setResult(newResult);
        }
        n();
    }, [loaded])

    const querySearch = () => {
        async function n() {
            setQueryLoaded(false);
            let newNfts = [];
            for (let piece of nfts) {
                if (await isValidNft(piece, searchConfig)) {
                    newNfts.push(piece);
                   
                }
            }
            setQueryNfts(newNfts);
            setQueryLoaded(true);
        }
        n()
    }

    useEffect(() => {
        if (loaded) {
            querySearch();
        }
    }, [searchConfig.artist, searchConfig.collection, searchConfig.name, searchConfig.price, searchConfig.rarity, loaded])

    useEffect(() => {
        querySearch();
    }, [])

    return { results, loaded, nfts: queryNfts, queryLoaded }

}

export function useAsyncNfts(config: SearchConfig,shouldContinue?:()=>boolean) {
    const [nfts, setNfts] = useState<PieceNFT[]>([])
    const [currentBlock, setBlock] = useState(0);
    const [canRun, setRun] = useState(true);
    const [loaded, setLoaded] = useState(false)
    //const [runTick, setRunTick] = useState(0);
    //const [time, setTime] = useState(100);
    const startRange = 30000;
    const [range, setRange] = useState(startRange);

    shouldContinue = shouldContinue?shouldContinue:()=>false;

    const _shouldContinue = shouldContinue();


    const changer = useWalletChanger(config.tacoProps.unifty);
    const reloadAll = () => {
        setNfts([])
        setRun(true);
        setLoaded(false)
        setRange(startRange);
        setMaxBlock();
    }
    /**
     * This effects reloads when any change in config except for pagesize
     */
    useEffect(() => {
        reloadAll();
    }, [changer])
    useEffect(() => {
        reloadAll();
    }, [])

    const setMaxBlock = useCallback(async () => {
        setBlock(await config.tacoProps.unifty.web3.eth.getBlockNumber())
    }, [config])

    const time = currentBlock <= 0 ? null : 100

    useEffect(() => {
        //setRunTick(runTick + 1)
        setRun(true);
        setLoaded(false)
    }, [config.nextCount,_shouldContinue])

    const interval = async () => {
        setRun(false);
        //console.log("Current block",currentBlock);
        const newNfts: PieceNFT[] = []
        const newBlock = currentBlock - range;
        let queryTacoshi = await config.tacoProps.unifty.getFarmNftsToBlock(config.tacoProps.unifty.tacoshiFarm, newBlock, currentBlock)
        for (let nft of queryTacoshi) {
            let metaNftUri = await config.tacoProps.unifty.getNftMeta(nft.erc1155, nft.id);
            const newF = { nft: nft, metaUri: metaNftUri }
            if (await isValidNft(newF, config)) {

                newNfts.push(newF);
            }
        }

        let queryRabbit = await config.tacoProps.unifty.getFarmNftsToBlock(config.tacoProps.unifty.rabbitFarm, newBlock, currentBlock)
        for (let nft of queryRabbit) {
            let metaNftUri = await config.tacoProps.unifty.getNftMeta(nft.erc1155, nft.id);
            const newF = { nft: nft, metaUri: metaNftUri }
            //  if (await isValidNft(newF, config)) {

            newNfts.push(newF);
            //}
        }
        setBlock(newBlock - range >= 0 ? newBlock : 0);
        setNfts([...nfts, ...newNfts])

        if (nfts.length + newNfts.length < config.minimumNfts || (shouldContinue()&&newBlock - range <= 0)) {
            setRun(true);
            setRange(range + (startRange / 2))

        } else { 
            setLoaded(true) 
        }
        if (newBlock - range <= 0) {
            setLoaded(true);
        }

    }


    useInterval(interval, canRun ? time : null);


    return { nfts, loaded };

}

async function isValidNft(nft: PieceNFT, config: SearchConfig): Promise<boolean> {

    const artist = config.artist == nft.nft.artist || !config.artist
    let  collection =  nft.nft.erc1155 == config.collection|| !config.collection
    let name = true;
    let rarity = true;

    if (config.name || config.rarity || config.collection) {
        const cardInfo = await getCardInfo(config.tacoProps, nft.nft.erc1155, nft.nft.id, { useMeta: true, useFarmData: false, useExtras: true })

        if (cardInfo.meta) {
            if (config.name) {
                name = cardInfo.meta.name.toLowerCase().includes(config.name.toLowerCase())
            }
            if (config.rarity) {
                const type = getCardType(cardInfo.nft.supply)
                rarity = config.rarity == type || !config.rarity;
            }
        }

    }



    return name && rarity && artist && collection
}

async function getAllNfts(unifty: Unifty) {
    let logs: IFarmData[] = [];
    let queryTacoshi = await unifty.getFarmNfts(unifty.tacoshiFarm);
    let queryRabbit = await unifty.getFarmNfts(unifty.rabbitFarm);

    if (queryRabbit && queryTacoshi)
        logs = [...queryTacoshi, ...queryRabbit]

    return logs;
}
