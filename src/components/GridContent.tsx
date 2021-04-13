import { Box, chakra, Container, Grid } from "@chakra-ui/react"
import React from "react"
import { columnTemplate } from "./TacoLayout"

function GridContentSX(props) {
    return <Grid templateColumns={columnTemplate} {...props}>
        <Box gridColumn="2/2">
            {props.children}
        </Box>
    </Grid>
}
const GridContent = chakra(GridContentSX);
export default GridContent;