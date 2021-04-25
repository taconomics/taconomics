import { Dispatch, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { TacoProps } from "../components/TacoLayout";
import BN from 'bn.js'


export interface ICardInfoConfig {
    useMeta?: boolean;
    useFarmData?: boolean;
    useExtras?: boolean
}
export interface INft {
    uri: string,
    supply: number,
    maxSupply: number
}
export interface IFarmData {
    artist?: string,
    controllerFee?: string,
    erc1155?: string,
    id?: number,
    pointsRaw?: number,
    nsfw?: boolean,
    points?: any,
    releaseTime?: string,
    shadowed?: boolean,
    supply?: number,
    mintFee?: string
    farmAddress?: string
    shopPrice?:number
}
export interface IMetaNft {
    name: string,
    description: string,
    image: string,
    animation_url?: string,
    audio_url?: string,
    external_link?: string,
    attributes?: IAttribute[]
}
export interface IAttribute {
    trait_type: string, value: any
}
export interface ICardInfo {
    nft: INft
    meta?: IMetaNft,
    farmData?: IFarmData
    extras?: { pointsPrice: number, balanceOf: string, coin: string,shopPrice:number }
    farmAddress?: string
    erc1155: string,
    id: number
    loaded: boolean
}
export function useCardInfo(tacoProps: TacoProps, erc1155: string, id: number, config?: ICardInfoConfig) {
    const [cardInfo, setCardInfo] = useState<ICardInfo>({ nft: { maxSupply: 0, supply: 0, uri: "" }, meta: { name: "", description: "", image: "" }, id: id, erc1155: erc1155, loaded: false })
    useEffect(() => {
        async function func(){
            const e =await getCardInfo(tacoProps, erc1155, id, config, cardInfo)
            setCardInfo(e);
        }
        func()
        
    }, [tacoProps.changer,erc1155,id])

    return cardInfo;

}

export async function getCardInfo(tacoProps: TacoProps,
    erc1155: string,
    id: number, config?: ICardInfoConfig,
    cardInfoCached?: ICardInfo): Promise<ICardInfo> {

    const unifty = tacoProps.unifty;
    if (await unifty.isConnected() && erc1155 && id) {
        let nft = await unifty.getNft(erc1155, id);
        let farmForSupply = unifty.tacoshiFarm;

        const cardInfo: ICardInfo = { ...cardInfoCached, nft: nft }
        cardInfo.id = id;
        cardInfo.erc1155 = erc1155;

        if (config.useFarmData) {
            let farmNftData = await unifty.farmNftData(farmForSupply, erc1155, id);
            if (farmNftData) {
                if (farmNftData.supply == 0) {
                    farmForSupply = unifty.rabbitFarm;
                    farmNftData = await unifty.farmNftData(farmForSupply, erc1155, id);

                    if (farmNftData.supply == 0) {
                        /**Not contained in any farm */
                        farmForSupply = undefined;
                    }
                }

                cardInfo.farmAddress = farmForSupply;
                cardInfo.farmData = farmNftData
                if (config.useExtras && farmForSupply) {
                    let pointsPrice = Number(farmNftData.points) / 1000000000000000000

                    let balanceOf = await unifty.balanceOf(erc1155, farmForSupply, id);

                    let coin = unifty.getCoinName(farmForSupply);

                    let addonAddress = await unifty.farmAddonAddress(farmForSupply)
                    console.log("Farm addon address",addonAddress,"Farm address",farmForSupply)

                    let shopPrice = await unifty.farmShopGetPrice(addonAddress,erc1155,id)
                    cardInfo.extras = { balanceOf: balanceOf, pointsPrice: pointsPrice, coin: coin,shopPrice:shopPrice }
                }
            }

        }

        if (config.useMeta) {
            let metaNft = await unifty.readUri(nft.uri);
            cardInfo.meta = metaNft ? metaNft : cardInfo.meta;
        }
        cardInfo.loaded = true;
        return cardInfo;
    }
    return { ...cardInfoCached,loaded:false }
}
