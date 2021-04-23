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
}
export interface IMetaNft {
    name: string,
    description: string,
    image: string,
    animation_url?: string,
    audio_url?: string,
    external_link?: string,
    attributes?: { trait_type: string, value: any }[]
}
export interface ICardInfo {
    nft: INft
    meta?: IMetaNft,
    farmData?: IFarmData
    extras?: { price: number, balanceOf: string, coin: string }
    farmAddress?: string
}
export function useCardInfo(tacoProps: TacoProps, erc1155: string, id: number, config?: ICardInfoConfig) {
    const [cardInfo, setCardInfo] = useState<ICardInfo>({ nft: { maxSupply: 0, supply: 0, uri: "" }, meta: { name: "", description: "", image: "" } })
    useEffect(() => {
        getCardInfo(tacoProps, erc1155, id, config, cardInfo).then(e => {
            setCardInfo(e);
        });
    }, [tacoProps.changer])

    return cardInfo;

}

export async function getCardInfo(tacoProps: TacoProps,
    erc1155: string,
    id: number, config?: ICardInfoConfig,
    cardInfoCached?: ICardInfo): Promise<ICardInfo> {
    const unifty = tacoProps.unifty;
    let nft = await unifty.getNft(erc1155, id);
    let farmForSupply = unifty.tacoshiFarm;

    const cardInfo: ICardInfo = { ...cardInfoCached }

    if (config.useFarmData) {
        let farmNftData = await unifty.farmNftData(farmForSupply, erc1155, id);

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
            let price = Number(farmNftData.points) / 1000000000000000000

            let balanceOf = await unifty.balanceOf(erc1155, farmForSupply, id);

            let coin = unifty.getCoinName(farmForSupply);

            cardInfo.extras = { balanceOf: balanceOf, price: price, coin: coin }
        }
    }

    if (config.useMeta) {
        let metaNft = await unifty.readUri(nft.uri);
        cardInfo.meta = metaNft ? metaNft : cardInfo.meta;
    }
    return cardInfo;
}