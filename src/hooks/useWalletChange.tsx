import { propNames, useInterval, useToast} from '@chakra-ui/react';
import React, { useState, useEffect, useRef } from 'react';
import Unifty from '../uniftyLib/UniftyLib';

export function useWalletChanger(unifty:Unifty) {
    const [changes,setChanges] = useState(0);
    const  toast = useToast()
   /* const tick = useInterval(async ()=>{
        let network = await unifty.web3.eth.net.getId();

        if(""+network != unifty.chain_id || unifty.account != await unifty.getAccount()){
            console.log("Network has changed!")
            unifty.init();
            setChanges(changes+1);
        }
    },1000);*/

    const reload = ()=>{
        unifty.init();
        setChanges(changes+1);
    }

    useEffect(()=>{
        console.log("Ether",window.ethereum)
        if(window.ethereum !=undefined){
            window.ethereum.on("accountsChanged",reload)

            window.ethereum.on("chainChanged",reload)
            window.ethereum.on('message', reload);
            
        }else{
            toast({description:"No ether"})
        }

    },[changes])

    
    return changes;
}