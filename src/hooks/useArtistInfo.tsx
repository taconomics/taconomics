import { useEffect } from "react";
import { FC, useState } from "react";
import { TacoProps } from "../components/TacoLayout";
import Box3 from '3box'

export function useArtistInfo(conf: TacoProps, address: string) {
    const [profile, setProfile] = useState({ name: address, description: "" });
    useEffect(()=>{
        async function e(){
            const profile = await Box3.getProfile(address)
           setProfile(profile);
        }
        e();
    },[conf.changer])

    return profile;
}