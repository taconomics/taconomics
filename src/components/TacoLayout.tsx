
import Unifty from "../uniftyLib/UniftyLib";
import Menu from "./Menu/Menu";
import React from 'react'
import { Box, Grid } from "@chakra-ui/react";


export default function TacoLayout(props){
    const unifty = new Unifty();

   let clonedElement = React.cloneElement(props.children, { unifty:unifty })
    return(<Grid>
      
        <Box><Menu unifty={unifty}></Menu></Box>
        <Box>{clonedElement}</Box>
        <Box>Footer</Box>
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