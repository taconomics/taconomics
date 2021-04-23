import { Dispatch, SetStateAction, useState } from "react";
import { useEffect } from "react";
import { TacoProps } from "../components/TacoLayout";


export interface ICardInfoConfig {
    useMeta?: boolean;
    useFarmData?: boolean;
    useExtras?: boolean
}
export interface ICardInfo {
    nft: { uri: string, supply: number, maxSupply: number }
    meta?: {
        name: string
        , description: string,
        image: string,
        animation_url?: string,
        audio_url?: string,
        external_link?: string,
        attributes?: { trait_type: string, value: any }[]
    },
    farmData?: {
        artist: string, controllerFee: string, erc1155: string, mintFee: string, nsfw: boolean, points: string, releaseTime: string, shadowed: boolean, supply: boolean
    }
    extras?: { price: number, balanceOf: string, coin: string }
    farmAddress?: string
}
export function useCardInfo(tacoProps: TacoProps, erc1155: string, id: number, config?: ICardInfoConfig) {
    const [cardInfo, setCardInfo] = useState<ICardInfo>({ nft: { maxSupply: 0, supply: 0, uri: "" }, meta: { name: "", description: "", image: "" } })
    useEffect(() => {
        getCardInfo(tacoProps, erc1155, id, config, setCardInfo);
    }, [tacoProps.changer])

    return cardInfo;

}

async function getCardInfo(tacoProps: TacoProps, erc1155: string, id: number, config?: ICardInfoConfig, setCardInfo?: Dispatch<SetStateAction<ICardInfo>>) {
    const unifty = tacoProps.unifty;
    let nft = await unifty.getNft(erc1155, id);
    let farmForSupply = unifty.tacoshiFarm;

    const cardInfo: ICardInfo = { nft: nft }

    if (config.useFarmData) {
        let farmNftData = await unifty.farmNftData(farmForSupply, erc1155, id);

        if (farmNftData.supply == 0) {
            farmForSupply = unifty.rabbitFarm;
            farmNftData = await unifty.farmNftData(farmForSupply, erc1155, id);
        }
        cardInfo.farmAddress = farmForSupply;
        cardInfo.farmData = farmNftData
        if (config.useExtras) {
            let price = Number(farmNftData.points) / 1000000000000000000
    
            let balanceOf = await unifty.balanceOf(erc1155, farmForSupply, id);
    
            let coin = unifty.getCoinName(farmForSupply);

            cardInfo.extras={balanceOf:balanceOf,price:price,coin:coin}
        }
    }

    if (config.useMeta) {
        let metaNft = await unifty.readUri(nft.uri);
        cardInfo.meta = metaNft;
    }

    setCardInfo(cardInfo);
}