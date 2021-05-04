import { useEffect, useState } from "react";
import myItems from "../../pages/my-items";
import { TacoProps } from "../components/TacoLayout";
import { getCardInfo, ICardInfo } from "./useCardInfo";

export interface ICollection{
    erc1155:string;
    contractURI:string
    name:string
    symbol:string
    nfts:ICardInfo[]
}

export function useMyItems(taco:TacoProps){
    const [myCollections,setMyCollections] = useState<ICollection[]>([]);
    const [loaded,setLoaded] = useState(false);

    console.log(myCollections)

    useEffect(()=>{
        async function func(){
            setLoaded(false);
            await taco.unifty.isConnected();
            const length = await taco.unifty.getMyErc1155Length();
            const cols:ICollection[] = []
            for(let a=0;a<length;a++){
                const colection = await taco.unifty.getMyErc1155(a)
               
                console.log(colection);
                const nfts:ICardInfo[] = []

                const mynfts = await taco.unifty.getMyNfts(colection.erc1155)
                for(const index of mynfts){
                    const nft = await taco.unifty.getNft(colection.erc1155,index)
                    const info = await getCardInfo(taco,colection.erc1155,index)
                    nfts.push(info)
                    //console.log("NFT",nft)
                }

                cols.push({...colection,nfts});
                
            }
            setMyCollections(cols);
            setLoaded(true)
            
        }
        func()
    },[taco.changer])

    return {myCollections,loaded}
}