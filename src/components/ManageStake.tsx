import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import React from "react";
import Unifty from "../uniftyLib/UniftyLib";

export default function ManageStake(props: { unifty: Unifty }) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (<Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button variant="ghost">Secondary Action</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>)
}