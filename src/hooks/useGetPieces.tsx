import { useEffect } from "react";
import { useState } from "react";
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
    collections: any[]
}
export const useGetPieces = (searchConfig: SearchConfig, changer: number) => {

    const [results, setResult] = useState<SearchResult>( { nfts: [], artist: [], collections: [] });

    useEffect(() => {
        async function func() {
            await searchConfig.unifty.isConnected();
            const res = await getResults(searchConfig);
            setResult(res)
            search(searchConfig, res);
        }

        func();
    }, [changer])

    return { results, }

}
async function getResults(config: SearchConfig) {
    let result: SearchResult = { nfts: [], artist: [], collections: [] };
    let allNfts = await getAllNfts(config.unifty);
    for (const index in allNfts) {
        let nft = allNfts[index]
        let metaNft = await config.unifty.getNftMeta(nft.erc1155,nft.id);
        let metaCollection = await config.unifty.getErc1155Meta(nft.erc1155);

       
        if (!result.artist.includes(nft.artist))
            result.artist.push(nft.artist);

        if(!result.nfts.includes(metaNft)){
            let real =await  config.unifty.readUri(metaNft)
            result.nfts.push({nft:nft,meta:real});
        }

        let hasCollection = true;
        result.collections.forEach(element => {
            hasCollection = (element.address != nft.erc1155)            
        });
        if(hasCollection){
            let real =await  config.unifty.readUri(metaCollection.contractURI)
            result.collections.push({address:nft.erc1155,meta:real});
        }
    }
    console.log(result);
    return result;
}
async function search(config: SearchConfig, results) {
    config.pageSize = config.pageSize ? config.pageSize : 10;
    console.log("page size", config.pageSize)

    await config.unifty.isConnected();

    console.log("Search", results);
}

async function getAllNfts(unifty: Unifty) {
    let logs = [];
    let queryTacoshi = await unifty.getFarmNfts(unifty.tacoshiFarm);
    let queryRabbit = await unifty.getFarmNfts(unifty.rabbitFarm);
    
    if (queryRabbit && queryTacoshi)
        logs = [...queryTacoshi, ...queryRabbit]

    return logs;
}