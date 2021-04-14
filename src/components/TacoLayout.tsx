
import Unifty from "../uniftyLib/UniftyLib";
import Menu from "./Menu/Menu";
import React, { useEffect } from 'react'
import { Box, Grid } from "@chakra-ui/react";
import Footer from "./Footer";
import { useState } from "react";

export const columnTemplate = "minmax(10px,.1fr) 3fr minmax(10px,.1fr)";
export default function TacoLayout(props){
    const unifty = new Unifty();
   // const colTem = "minmax(10px,.1fr) 3fr minmax(10px,.1fr)";
    const rowTem = "100px 3fr 1fr";

   let clonedElement = React.cloneElement(props.children, { unifty:unifty })
    return(<Grid templateColumns={columnTemplate} maxWidth="100vw" templateRows={rowTem}>
      
        <Box gridColumn="2/2"><Menu unifty={unifty}></Menu></Box>
        <Box  gridColumn="1/4">{clonedElement}</Box>
        <Box  gridColumn="1/4"><Footer></Footer></Box>
    </Grid>
    )
}

export async function getStaticProps(){
    const unifty = new Unifty();
    console.log("in static")
    return {props:{unifty:unifty}}
}

export const getServerSideProps = async () => {
    const data = "hola"
  
    return {
      props: data,
    };
  }