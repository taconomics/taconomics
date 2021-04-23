
import Unifty from "../uniftyLib/UniftyLib";
import Menu from "./Menu/Menu";
import React, { useEffect } from 'react'
import { Box, Flex, Grid } from "@chakra-ui/react";
import Footer from "./Footer";
import { useWalletChanger } from "../hooks/useWalletChange";

export const columnTemplate = "minmax(10px,40px) auto minmax(10px,40px)";

export interface TacoProps{
    unifty:Unifty;
    changer:number;
}
export default function TacoLayout(props) {
    const unifty = new Unifty();
    const rowTem = "100px auto 1fr";

    const changer = useWalletChanger(unifty);
    useEffect(()=>{
        console.log("Change tacolayout "+ changer)
    },[changer])

    let clonedElement = React.cloneElement<TacoProps>(props.children, { unifty: unifty,changer })
    return (
            <Grid templateColumns={columnTemplate} minH={"100vh"} templateRows={rowTem}>

                <Box gridColumn="2/2"><Menu changer={changer} unifty={unifty}></Menu></Box>
                <Box gridColumn="1/4">{clonedElement}</Box>
                <Footer></Footer>
            </Grid>
    )
}