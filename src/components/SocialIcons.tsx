import { Box, chakra, Flex, LinkBox } from "@chakra-ui/react";
import React from "react";
import { AiOutlineInstagram, AiOutlineTwitter, AiOutlineGithub } from 'react-icons/ai'
import NextLink from 'next/link'

function SocialIconsSX(props: { iconColor?, size?, Container?}) {
    let { iconColor, size, Container } = props;
    iconColor = iconColor ? iconColor : "white"
    size = size ? size : "20px"
    Container = Container ? Container : <Box></Box>
    return (<Flex {...props}>
        <a target="_blank" href="https://instagram.com/" rel="noopener noreferrer"><LinkBox><Container><AiOutlineInstagram color={iconColor} size={size}></AiOutlineInstagram></Container></LinkBox></a>
        <a target="_blank" href="https://twitter.com/" rel="noopener noreferrer"><LinkBox><Container><AiOutlineTwitter color={iconColor} size={size}></AiOutlineTwitter></Container></LinkBox></a>
        <a target="_blank" href="https://github.com/" rel="noopener noreferrer"><LinkBox><Container><AiOutlineGithub color={iconColor} size={size}></AiOutlineGithub></Container></LinkBox></a>
    </Flex>)
}

export const SocialIcons = chakra(SocialIconsSX);

