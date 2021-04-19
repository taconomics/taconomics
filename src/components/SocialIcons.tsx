import { Box, chakra, Flex } from "@chakra-ui/react";
import React from "react";
import { AiOutlineInstagram,AiOutlineTwitter,AiOutlineGithub } from 'react-icons/ai'

function SocialIconsSX(props:{color?,size?,Container?}) {
    let {color,size,Container} = props;
    color=color?color:"white"
    size=size?size:"20px"
    Container=Container?Container:<Box></Box>
    return (<Flex {...props}>
        <Container><AiOutlineInstagram color={color} size={size}></AiOutlineInstagram></Container>
        <Container><AiOutlineTwitter color={color} size={size}></AiOutlineTwitter></Container>
        <Container><AiOutlineGithub color={color} size={size}></AiOutlineGithub></Container>
    </Flex>)
}

export  const SocialIcons= chakra(SocialIconsSX);
