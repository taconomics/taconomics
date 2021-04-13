import { Box, Button, Center, toast, ToastPosition, useToast } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import Unifty from "../uniftyLib/UniftyLib";

export default function UploadImage({ image, setImage, unifty }) {
    const [hover, setHover] = useState(false)
    const onEnter = () => {
        setHover(true);
    }
    const onExit = () => {
        setHover(false);
    }
    return (<Box minWidth="300px" height="180px" overflow="hidden" marginRight={10} onPointerEnter={onEnter} onPointerLeave={onExit}

        backgroundImage={image != undefined ? "url(" + image + ")" : "none"} backgroundPosition="center"
        backgroundSize="500px" borderRadius="lg">
        {<Center backgroundColor="blackAlpha.700" height="100%" marginTop={hover ? "0%" : "100%"} transition="margin-top .5s">
            <FileUpload unifty={unifty} setImage={setImage}></FileUpload>
        </Center>}
    </Box>)
}
const FileUpload = ({ setImage, unifty }) => {
    const inputRef = useRef<HTMLInputElement>();
    const u: Unifty = unifty;
    const toast = useToast();
    let toastTime = 2000;
    let toastPosition:ToastPosition = "bottom-right";
    const toastIdRef = React.useRef()
    const clickButton = () => {
        inputRef.current.click();
    }
    const handleFileInput = (e) => {
        // handle validations

        var reader = new FileReader();
        reader.onload = async function () {
            console.log(reader.result)
            toast({
                title: "File is uploading",
                description: "Please wait...",
                status: "info",
                duration: toastTime,
                position: toastPosition,
                isClosable: true,
            })
            let ipfs = await u.ipfs.add(reader.result);
            let ipfsUrl = "https://gateway.ipfs.io/ipfs/" + ipfs.path;
            setImage(ipfsUrl);
        };
        reader.readAsArrayBuffer(e.target.files[0]);

    }
    return (<Box>
        <input style={{ display: "none" }} ref={inputRef} type="file" accept="image/*" onChange={handleFileInput} />
        <Button variant="outline" colorScheme="figma.white" onClick={clickButton}>Choose photo</Button>
    </Box>)
}