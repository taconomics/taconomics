import { Box, Center, Divider, Flex, useStyleConfig } from "@chakra-ui/react"
import Image from "next/image"
import React from "react"
import { Logo, LogoVariants, MenuItems } from "./Menu/Menu"
import { SocialIcons } from "./SocialIcons"

export default function Footer() {
    const width = ["80%"]
    return (<Flex paddingY={5} 
     backgroundColor="figma.footer" flexDir="column" color="gray.200" 
     alignItems="center" justifyContent="center" gridColumn="1/4"
      height="100%" width="100%"
      >
        <Flex justifyContent="space-around" flexDir="column" width={["100%", "70%", "60%"]}>
            <Center><Logo variant={LogoVariants.WHITE}></Logo></Center>
            <MenuItems variant="footer"></MenuItems>

        </Flex>
        <Divider marginY={3} color="gray.500" w={width}></Divider>
        <FooterSignature width={width}></FooterSignature>

    </Flex>)
}
function FooterSocialContainer(props) {
    return (<Box padding={1} marginX={1} borderRadius="full" backgroundColor="gray.600">{props.children}</Box>)
}
function FooterSignature(props:{width}) {
    return (<Flex justifyContent="space-between" width={props.width} flexDir={["column","row","row"]}>
        <Box>© 2020 Taconomics. All rights reserved</Box>
        <SocialIcons size={20} Container={FooterSocialContainer} marginY={[3,0,0]} alignItems="center" justifyContent="center"></SocialIcons>
    </Flex>)
}