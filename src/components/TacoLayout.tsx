
import Unifty from "../uniftyLib/UniftyLib";
import Menu from "./Menu/Menu";
import React, { useEffect } from 'react'
import { Box, Flex, Grid } from "@chakra-ui/react";
import Footer from "./Footer";

export const columnTemplate = "minmax(10px,40px) auto minmax(10px,40px)";
export default function TacoLayout(props) {
    const unifty = new Unifty();
    const rowTem = "100px auto 1fr";

    let clonedElement = React.cloneElement(props.children, { unifty: unifty })
    console.log("Cloned", clonedElement);
    return (
            <Grid templateColumns={columnTemplate} minH={"100vh"} templateRows={rowTem}>

                <Box gridColumn="2/2"><Menu unifty={unifty}></Menu></Box>
                <Box gridColumn="1/4">{clonedElement}</Box>
                <Footer></Footer>
            </Grid>
    )
}

export async function getStaticProps() {
    const unifty = new Unifty();
    console.log("in static")
    return { props: { unifty: unifty } }
}

export const getServerSideProps = async () => {
    const data = "hola"

    return {
        props: data,
    };
}