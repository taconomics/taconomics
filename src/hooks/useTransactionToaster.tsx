import { ToastPosition, useToast } from "@chakra-ui/react"
import { useEffect } from "react";
import { useState } from "react";

interface Values {
    title: string;
    description: string;
    handler?: (e) => any;
}
interface Results {
    onLoad: (e) => any;
    onSuccess: (e) => any;
    onError: (e) => any;
}
interface Preferences {
    showError: boolean;
}
export const useTrasactionToaster = (_onLoad: Values, _onSucces: Values, _onError: Values, preferences?: Preferences) => {
    const toastTime = 10000;
    const toastPosition: ToastPosition = "bottom-right"
    const toast = useToast();
    preferences = preferences ? preferences : { showError: false }
    const onLoad = (e) => {
        toast({
            title: _onLoad.title,
            description: _onLoad.description,
            status: "info",
            duration: toastTime / 2,
            position: toastPosition,
            isClosable: true,
        })
        if (_onLoad.handler) {
            _onLoad.handler(e);
        }
    }
    const onSucces = (e) => {
        toast({
            title: _onSucces.title,
            description: _onSucces.description,
            status: "success",
            duration: toastTime / 2,
            position: toastPosition,
            isClosable: true,
        })
        if (_onSucces.handler) {
            _onSucces.handler(e);
        }
    }

    const onError = (e) => {
        console.log(e);
        toast({
            title: _onError.title,
            description: preferences.showError ? e.message : _onError.description,
            status: "error",
            duration: toastTime / 2,
            position: toastPosition,
            isClosable: true,
        })
        if (_onError.handler) {
            _onError.handler(e);
        }
    }

    return { onLoad: onLoad, onSuccess: onSucces, onError: onError };
}