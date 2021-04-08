import { Box, chakra, Container, Grid } from "@chakra-ui/react"
import React from "react"
import { columnTemplate } from "./TacoLayout"

function GridContentSX({ children }) {
    return <Grid templateColumns={columnTemplate}>
        <Box gridColumn="2/2">
            {children}
        </Box>
    </Grid>
}
const GridContent = chakra(GridContentSX);
export default GridContent;