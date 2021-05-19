import { Box, VStack } from "@chakra-ui/react";
import React from "react";
import { TacoProps } from "../src/components/TacoLayout";
import {LoremIpsum } from 'react-lorem-ipsum'

export default function Privacy(props: TacoProps) {
    props.changeTitle("Privacy policy")
    return <VStack>
        <Box fontSize="xx-large" fontWeight="bold">
            Privacy policy
        </Box>
        <VStack w={["100%","60%","60%"]} marginBottom={5}>
            <Box>
                $TACO and $SALSA token are purely entertainment, not an investment. Purely an experimental GAME. Before purchasing $TACO tokens or making $SALSA tokens, you must ensure that the nature, complexity and risks inherent in the trading of cryptocurrency are suitable for your objectives in light of your circumstances and financial position. You should only purchase $TACO to have fun and to experience this experimental game with us. Many factors outside of the control of $TACO Token will effect the market price, including, but not limited to, national and international economic, financial, regulatory, political, terrorist, military, and other events, adverse or positive news events and publicity, and generally extreme, uncertain, and volatile market conditions. Extreme changes in price may occur at any time, resulting in a potential loss of value, complete or partial loss of purchasing power, and difficulty or a complete inability to sell or exchange your digital currency. $TACO Token shall be under no obligation to purchase or to broker the purchase back from you of your cryptocurrency in circumstances where there is no viable market for the purchase of the same. None of the content published on this site constitutes a recommendation that any particular cryptocurrency, portfolio of cryptocurrencies, transaction or investment strategy is suitable for any specific person. None of the information providers or their affiliates will advise you personally concerning the nature, potential, value or suitability of any particular cryptocurrency, portfolio of cryptocurrencies, transaction, investment strategy or other matter. The products and services presented on this website may only be purchased in jurisdictions in which their marketing and distribution are authorized. Play at your own risk and may the odds be ever in your favor.
            </Box>
        </VStack>
    </VStack>
}