import { Box, Flex, useStyleConfig } from "@chakra-ui/react"
import Image from "next/image"
import React from "react"
import {MenuItems } from "./Menu/Menu"

export default function Footer(){
    return(<Flex backgroundColor="figma.footer" gridColumn="1/4" height="100%" width="100%">
       <MenuItems variant="footer"></MenuItems>
    </Flex>)
}
