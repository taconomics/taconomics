
import Unifty from "../uniftyLib/UniftyLib";
import Menu from "./Menu/Menu";
import React, { useEffect, useState } from 'react'
import { Box, Flex, Grid } from "@chakra-ui/react";
import Footer from "./Footer";
import { useWalletChanger } from "../hooks/useWalletChange";
import { Head, Html } from 'next/document'

export const columnTemplate = "minmax(10px,40px) auto minmax(10px,40px)";

export interface TacoProps {
    unifty: Unifty;
    changer: number;
    changeTitle:(newTitle:string)=>any
}
export default function TacoLayout(props) {
    const unifty = new Unifty();
    const rowTem = "100px auto 1fr";
    const [title,setTitle] = useState("");

    const changer = useWalletChanger(unifty);
    useEffect(() => {
        console.log("Change tacolayout " + changer)
    }, [changer])

    const changeTitle = (newTitle:string) =>{
        setTitle(newTitle);
    }

    useEffect(()=>{
        document.title = "Taconomics — "+title;
    },[title])

    let clonedElement = React.cloneElement(props.children, { unifty: unifty, changer,changeTitle })
    return (
        <Grid templateColumns={columnTemplate} minH={"100vh"} templateRows={rowTem}>
            <Box gridColumn="2/2"><Menu changer={changer} unifty={unifty} changeTitle={changeTitle}></Menu></Box>
            <Box gridColumn="1/4">{clonedElement}</Box>
            <Footer></Footer>
        </Grid>
    )
}