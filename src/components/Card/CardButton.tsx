import { Box, Button, chakra, HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ICardInfo } from "../../hooks/useCardInfo";
import { useTrasactionToaster } from "../../hooks/useTransactionToaster";
import { TacoProps } from "../TacoLayout";

export function CardButtonSX(props: { taco: TacoProps, CardInfo: ICardInfo,loaded:boolean }) {
    const [connected, setConnected] = useState(false);
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure()
    const buyToast = useTrasactionToaster({ title: "Buying card", description: "Please wait..." }, { title: "Transaction complete", description: "Thank you!" }, { title: "Error", description: "Some error has ocurred" })

    const onClick = async () => {

        if (Number(props.CardInfo.extras.balanceOf) > 0) {
            if (props.CardInfo.farmData.prices.totalFee != 0 && !props.CardInfo.farmShopAddress) {

            } else {
                //onClickPoints(props.CardInfo, props.taco, buyToast)
            }
            onOpen();
        } else {
            window.open("https://opensea.io/assets/" + props.CardInfo.erc1155 + "/" + props.CardInfo.id, "_blank");
        }

    }
    useEffect(() => {
        async function con() {
            setConnected(await props.taco.unifty.isConnected() && props.loaded);
        }
        con();
    }, [props.taco.changer, props.CardInfo])
    return (<>
        <Button variant="outline" onClick={onClick} colorScheme="figma.orange" {...props}>
            {connected ? Number(props.CardInfo.extras ? props.CardInfo.extras.balanceOf : 0) > 0 ? "Buy now" : "Check on OpenSea" : "Connect to wallet"}
        </Button>
        {<BuyModal loaded={props.loaded} buyToast={buyToast} taco={props.taco} isOpen={isOpen} onClose={onClose} CardInfo={props.CardInfo} ></BuyModal>}
    </>)
}
export const CardButton = chakra(CardButtonSX);

const onClickPoints = async (CardInfo: ICardInfo, taco: TacoProps, buyToast,loaded:boolean) => {
    if (loaded) {
        taco.unifty.farmRedeem(CardInfo.farmAddress, CardInfo.erc1155, CardInfo.id, (CardInfo.farmData.prices.totalFee).toString(), buyToast.onLoad, buyToast.onSuccess, buyToast.onError)
    }
}

function BuyModal(props: { isOpen, onClose, CardInfo: ICardInfo, taco: TacoProps, buyToast,loaded:boolean }) {
    const { isOpen, onClose, CardInfo } = props;
    const iconSize = "17px"

    const onClickEth = async () => {
        if (props.loaded) {

            let prices = await props.taco.unifty.farmShopGetPrice(CardInfo.farmShopAddress, CardInfo.erc1155, CardInfo.id);
            let _price = props.taco.unifty.web3.utils.toBN(prices[0]).add(props.taco.unifty.web3.utils.toBN(prices[1]));

            let final = props.taco.unifty.web3.utils.toBN("0");
            final = final.add(_price);

            console.log("final price", final.toString())

            await props.taco.unifty.farmShopBuy(props.CardInfo.erc1155,
                props.CardInfo.id,
                1,
                final,
                props.CardInfo.farmShopAddress,
                props.buyToast.onLoad,
                props.buyToast.onSuccess,
                props.buyToast.onError);
        }


    }
    return (<Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        {CardInfo.extras&&<ModalContent>
            <ModalHeader>How do you want to buy this item?</ModalHeader>
            <ModalCloseButton />
            <ModalBody marginBottom={5}>{
                props.loaded &&
                <HStack justifyContent="center" w="100%" spacing={5}>
                    {props.CardInfo.farmShopAddress && props.CardInfo.extras.shopPrice &&
                        <Button onClick={onClickEth}>
                           <HStack> <Image src="/icons/Eth_Icon.svg" h={iconSize}></Image> <Box>{CardInfo.extras.shopPrice}</Box></HStack>
                        </Button>}
                    <Button onClick={() => {
                        onClickPoints(props.CardInfo, props.taco, props.buyToast,props.loaded)
                    }}><HStack>
                        <Image src={"/icons/" + CardInfo.extras.coin + "_Icon.svg"} h={iconSize}></Image>
                        <Box>{CardInfo.extras.pointsPrice}</Box>
                        <Box>+</Box>
                        <Image src="/icons/Eth_Icon.svg" h={iconSize}></Image> <Box>{CardInfo.farmData.prices.totalFeeDecimals}</Box>
                    </HStack>
                    </Button>
                </HStack>}

            </ModalBody>
        </ModalContent>}
    </Modal>)
}