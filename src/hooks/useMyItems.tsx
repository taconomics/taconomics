import { useEffect, useState } from "react";
import myItems from "../../pages/my-items";
import { TacoProps } from "../components/TacoLayout";
import { getCardInfo, ICardInfo } from "./useCardInfo";
import { PieceNFT, useAsyncNfts, useGetPieces } from "./useGetPieces";

export interface ICollection{
    erc1155:string;
    contractURI:string
    name:string
    symbol:string
    nfts:ICardInfo[]
}

export function useMyItems(taco:TacoProps){
    //const [loaded,setLoaded] = useState(false);
    const [newNfts,setNfts] = useState<PieceNFT[]>([]);

    const {nfts,loaded} = useAsyncNfts({tacoProps:taco,minimumNfts:30,nextCount:0},()=>true)

    console.log(nfts)

    useEffect(()=>{
        async function func(){
           // setLoaded(false);
            await taco.unifty.isConnected();
           // const length = await taco.unifty.getMyErc1155Length();
            const p:PieceNFT[] = []
            for(let nft of nfts){
                let balanceof = await taco.unifty.balanceof(nft.nft.erc1155, taco.unifty.account,nft.nft.id);
                console.log("balance of",balanceof);
                if(balanceof>0){
                    p.push(nft);
                }
            }
            if(p.length>newNfts.length){
                setNfts(p); 
                //setLoaded(true)
            }
           
           
            
        }
        func()
    },[taco.changer,nfts])

    return {nfts:newNfts,loaded}
}