import { Box, chakra, Flex, LinkBox,Image } from "@chakra-ui/react";
import React from "react";
import { AiOutlineInstagram, AiOutlineTwitter, AiOutlineGithub } from 'react-icons/ai'
import {FaTelegramPlane} from 'react-icons/fa'
import NextLink from 'next/link'

function SocialIconsSX(props: { iconColor?, size?, Container?}) {
    let { iconColor, size, Container } = props;
    iconColor = iconColor ? iconColor : "white"
    size = size ? size : "20px"
    Container = Container ? Container : <Box></Box>
    return (<Flex {...props}>
        <a target="_blank" href="https://t.me/taconomics" rel="noopener noreferrer"><LinkBox>
        <Container><FaTelegramPlane color={iconColor} size={size}/></Container></LinkBox></a>
        <a target="_blank" href="http://twitter.com/taconomics101" rel="noopener noreferrer"><LinkBox>
        <Container><AiOutlineTwitter color={iconColor} size={size}></AiOutlineTwitter></Container></LinkBox></a>
        <a target="_blank" href="https://taconomics.medium.com" rel="noopener noreferrer">
            <LinkBox>
        <Box><Container><Image src={iconColor=="black"?"/icons/Medium_Icon_Black.svg":"/icons/Medium_Icon.svg"}  w={size+"px"}></Image></Container></Box>
        </LinkBox></a>
    </Flex>)
}

export const SocialIcons = chakra(SocialIconsSX);

