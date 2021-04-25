
import { useCallback, useEffect } from "react";
import { useState } from "react";
import { CardTypes } from "../components/Card/Card";
import { TacoProps } from "../components/TacoLayout";
import Unifty from "../uniftyLib/UniftyLib";
import { getCardInfo, ICardInfo, IFarmData, IMetaNft, INft, useCardInfo } from "./useCardInfo";
import useInterval from "./useInterval";

export interface SearchConfig {
    artist?: string,
    collection?: string,
    rarity?: number,
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
    const {nfts,loaded} = useAsyncNfts(searchConfig);

    //const [nfts, setNfts] = useState<PieceNFT[]>([])
    useEffect(()=>{
        let newResult = results?{...results}:{...emptyResult};
        nfts.forEach(nft => {
            if(!results.artist.includes(nft.nft.artist)){
                newResult.artist.push(nft.nft.artist);
            }
        });

        setResult(newResult);
    },[loaded])



    return { results, loaded, nfts }

}

function useAsyncNfts(config: SearchConfig ){
    const [nfts, setNfts] = useState<PieceNFT[]>([])
    const [currentBlock, setBlock] = useState(0);
    const [canRun, setRun] = useState(true);
    const [loaded,setLoaded] = useState(false)
    //const [runTick, setRunTick] = useState(0);
    //const [time, setTime] = useState(100);
    const startRange = 150000;
    const [range,setRange] = useState(startRange);
    /**
     * This effects reloads when any change in config except for pagesize
     */
    useEffect(() => {
        setNfts([])
        setRun(true);
        setLoaded(false)
        setRange(startRange);
        setMaxBlock();
    }, [config.tacoProps.changer, config.artist, config.collection, config.name, config.rarity])

    const setMaxBlock = useCallback(async () => {
        setBlock(await config.tacoProps.unifty.web3.eth.getBlockNumber())
    }, [config])

    const time = currentBlock <= 0 ? null : 100

    useEffect(() => {
        //setRunTick(runTick + 1)
        setRun(true);
        setLoaded(false)
    }, [config.nextCount])

    const interval = useCallback(async () => {
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
            if (await isValidNft(newF, config)) {

                newNfts.push(newF);
            }
        }
        setBlock(newBlock - range >= 0 ? newBlock : 0);
        setNfts([...nfts, ...newNfts])

        if (nfts.length + newNfts.length < config.minimumNfts) {
            setRun(true);
            setRange(range+(startRange/2))

        } else { setLoaded(true) }
        if(newBlock - range <=0){
            setLoaded(true);
        }

    }, [config, nfts, currentBlock, canRun, config.nextCount])


    useInterval(interval, canRun ? time : null);


    return {nfts,loaded};

}

async function isValidNft(nft: PieceNFT, config: SearchConfig): Promise<boolean> {

    const artist = config.artist == nft.nft.artist || !config.artist
    const collection = config.collection == nft.nft.erc1155 || !config.collection
    let name = true;
    let rarity = true;
    if (config.name || config.rarity) {
        const cardInfo = await getCardInfo(config.tacoProps, nft.nft.erc1155, nft.nft.id, { useMeta: true, useFarmData: true, useExtras: true })
        console.log("CardInfo", cardInfo);
        if (cardInfo.meta) {
            if (config.name) {
                name = cardInfo.meta.name.toLowerCase().includes(config.name.toLowerCase())
                console.log("Contains name", name);
            }
            if (config.rarity) {
                rarity = config.rarity == cardInfo.nft.supply || !config.rarity;
            }
        }

    }


    return name && rarity && artist
}

async function getAllNfts(unifty: Unifty) {
    let logs: IFarmData[] = [];
    let queryTacoshi = await unifty.getFarmNfts(unifty.tacoshiFarm);
    let queryRabbit = await unifty.getFarmNfts(unifty.rabbitFarm);

    if (queryRabbit && queryTacoshi)
        logs = [...queryTacoshi, ...queryRabbit]

    return logs;
}
