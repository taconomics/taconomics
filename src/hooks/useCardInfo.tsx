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
    balance: number;
}
export interface IPrices {
    totalFee: number
    totalFeeDecimals: number;


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
    prices?: IPrices
}
export interface IMetaNft {
    name: string,
    description: string,
    image: string,
    animation_url?: string,
    audio_url?: string,
    external_link?: string,
    attributes?: ITrait[]
}
export interface ITrait {
    trait_type: string, value: any
}
export interface ICardInfo {
    nft: INft
    meta?: IMetaNft,
    farmData?: IFarmData
    extras?: { pointsPrice: number, balanceOf: string, coin: string, shopPrice: number }
    farmAddress?: string
    farmShopAddress?: string
    erc1155: string,
    id: number
}
export function useCardInfo(tacoProps: TacoProps, erc1155: string, id: number, config?: ICardInfoConfig) {
    const [cardInfo, setCardInfo] = useState<ICardInfo>({ nft: { maxSupply: 0, supply: 0, uri: "", balance: 0 }, meta: { name: "", description: "", image: "" }, id: id, erc1155: erc1155 })
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        async function func() {
            setLoaded(false);
            const e = await getCardInfo(tacoProps, erc1155, id, config, cardInfo, setLoaded)
            setCardInfo(e);
            setLoaded(true);
        }
        func()

    }, [tacoProps.changer, erc1155, id])

    return { cardInfo, loaded };

}

export async function getCardInfo(tacoProps: TacoProps,
    erc1155: string,
    id: number, config?: ICardInfoConfig,
    cardInfoCached?: ICardInfo, setLoaded?: (loaded: boolean) => any): Promise<ICardInfo> {

    const unifty = tacoProps.unifty;
    await unifty.isConnected();

    let nft = await unifty.getNft(erc1155, id);
    let farmForSupply = unifty.tacoshiFarm;

    const cardInfo: ICardInfo = { ...cardInfoCached, nft: nft, erc1155: erc1155, id: id }
    cardInfo.id = id;
    cardInfo.erc1155 = erc1155;
    cardInfo.nft=nft;
    if (config) {
        if (setLoaded) { setLoaded(false); }
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
                let addonAddress = await unifty.farmAddonAddress(farmForSupply)
                cardInfo.farmShopAddress = addonAddress;

                cardInfo.farmAddress = farmForSupply;
                cardInfo.farmData = farmNftData


                const totalFee = Number(cardInfo.farmData.mintFee) + Number(cardInfo.farmData.controllerFee);
                cardInfo.farmData.prices = { totalFee: totalFee, totalFeeDecimals: totalFee / 1000000000000000000 }
                if (config.useExtras && farmForSupply) {
                    let pointsPrice = Number(farmNftData.points) / 1000000000000000000

                    let balanceOf = await unifty.balanceOf(erc1155, farmForSupply, id);

                    let coin = unifty.getCoinName(farmForSupply);
                    let prices = await unifty.farmShopGetPrice(addonAddress, erc1155, id)
                    let shopPrice = undefined;
                    if (prices) {
                        shopPrice = unifty.web3.utils.toBN(prices[0]).add(unifty.web3.utils.toBN(prices[1])).toNumber() / 1000000000000000000
                    }
                    cardInfo.extras = { balanceOf: balanceOf, pointsPrice: pointsPrice, coin: coin, shopPrice: shopPrice }
                }
            }

        }

        if (config.useMeta) {
            let metaNft;
            try {
                metaNft = await unifty.readUri(cardInfo.nft.uri);
            } catch (e) {

            }

            cardInfo.meta = metaNft ? metaNft : cardInfo.meta;


        }
    }


    //cardInfo.loaded = true;
    if (setLoaded) { setLoaded(true); }
    return cardInfo;
}
