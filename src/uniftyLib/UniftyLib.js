import Web3 from "web3";
import { erc1155ABI } from '../contracts/erc1155ABI';
import { erc20ABI } from '../contracts/erc20ABI';
import { nifABI } from '../contracts/nifABI';
import { genesisABI } from '../contracts/genesisABI';
import { farmABI } from '../contracts/farmABI';
import { farmShopABI } from '../contracts/farmShopABI';
import { createContext, useEffect } from "react";

//const web3 = createContext(new Web3(Web3.givenProvider || "ws://localhost:8545"));

export default class Unifty {
    web3
    min_block = 0;
    sleep_time = 20;
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        //this.web3.

        this.setParams("4");
        this.setAccount();

    }
    async isConnected() {
        var ab;
        try {
            let ac = await this.web3.eth.requestAccounts();
            ab = ac[0];

            //return true;
        } catch (e) {

        }
        if (ab == undefined) {
            return false;
        } else {
            return true;
        }

    }
    setParams(chain_id) {
        if (chain_id === "4") {

            this.nif = new this.web3.eth.Contract(nifABI, '0xb93370d549a4351fa52b3f99eb5c252506e5a21e', { from: this.account });
            this.erc1155 = new this.web3.eth.Contract(erc1155ABI, '0xD329D511Bc8368Be4396Cc489B6161af1b275803', { from: this.account });
            this.genesis = new this.web3.eth.Contract(genesisABI, '0xD0B9250e4d6786ec3205E8c303eCF6FF4e8b0270', { from: this.account });
            this.farm = new this.web3.eth.Contract(farmABI, '0x9103F8A3063905DB85031a8e700EA7729504EaEA', { from: this.account });
            this.farmShop = new this.web3.eth.Contract(farmShopABI, '0xe6f337111Cb71CC1dfB92175cC0e8Cbc3F584fBA', { from: this.account });
            this.account = '';
            this.defaultProxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317'; // opensea

            // xDAI MAINNET
        }
    }

    async getAccount() {
        let ac = this.web3.eth.accounts.create().address;

        this.web3.eth.requestAccounts().then(e => {
            ac = e[0];
        }).catch((e) => {
            console.log("Request rejected");
        });

        return ac;
    }

    async setAccount() {

        this.account = await this.getAccount();

    };

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Farms
     */

    /**
     * @param {*} farmAddress 
     * @returns Farm token
     */

    async farmToken(farmAddress) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        return await farm.methods.token().call({ from: this.account });
    };

    async farmTokenDecimals(farmAddress) {
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new this.web3.eth.Contract(erc20ABI, farm_token, { from: this.account });
        await this.sleep(this.sleep_time);
        return await erc20.methods.decimals().call({ from: this.account });
    };
    async farmNftData(farmAddress, erc1155Address, id) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        return await farm.methods.cards(erc1155Address, id).call({ from: this.account });
    };
    async farmJsonUrl(farmAddress) {

        await this.sleep(this.sleep_time);

        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let events = await farm.getPastEvents('FarmUri', {
            filter: {
                farm: farmAddress
            },
            fromBlock: this.min_block,
            toBlock: 'latest'
        });

        //console.log(events);

        return events.length > 0 ? events[events.length - 1].returnValues.uri : '';
    };

    async getFarmNfts(farmAddress) {

        await this.sleep(this.sleep_time);

        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });

        let cards = await farm.getPastEvents('CardAdded', {
            fromBlock: this.min_block,
            toBlock: 'latest'
        });

        let check_entries = [];
        cards = cards.reverse();
        let card_data = [];

        let decimals = await this.farmTokenDecimals(farmAddress);

        for (let i = 0; i < cards.length; i++) {

            if (check_entries.includes(cards[i].returnValues.erc1155 + cards[i].returnValues.card)) {
                continue;
            }

            let data = await this.farmNftData(farmAddress, cards[i].returnValues.erc1155, cards[i].returnValues.card);

            card_data.push(
                {
                    erc1155: cards[i].returnValues.erc1155,
                    id: cards[i].returnValues.card,
                    points: Number(data.points / Math.pow(10, decimals >= 0 ? decimals : 0)).toFixed(8),
                    pointsRaw: data.points / Math.pow(10, decimals >= 0 ? decimals : 0),
                    mintFee: this.web3.utils.toBN(data.controllerFee).add(this.web3.utils.toBN(data.mintFee)),
                    artist: data.artist,
                    releaseTime: data.releaseTime,
                    nsfw: data.nsfw,
                    shadowed: data.shadowed
                }
            );

            check_entries.push(cards[i].returnValues.erc1155 + cards[i].returnValues.card);
        }

        return card_data;
    };

    /**
     * Nfts
     */

    async getNft(erc1155Address, nftId) {

        let supply = 0;
        let maxSupply = 0;

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });
        try {
            await this.sleep(this.sleep_time);
            supply = await erc1155.methods.totalSupply(nftId).call({ from: this.account });
            await this.sleep(this.sleep_time);
            maxSupply = await erc1155.methods.maxSupply(nftId).call({ from: this.account });
        } catch (e) { }
        await this.sleep(this.sleep_time);
        let balance = await erc1155.methods.balanceOf(this.account, nftId).call({ from: this.account });
        let uri = await this.getNftMeta(erc1155Address, nftId);

        return { uri: uri, supply: supply, maxSupply: maxSupply, balance: balance };
    };

    async getNftMeta(erc1155ContractAddress, nftId) {

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155ContractAddress, { from: this.account });

        let nftUri = '';
        try {
            await this.sleep(this.sleep_time);
            nftUri = await erc1155.methods.uri(nftId).call({ from: this.account });
        } catch (e) {
            try {
                nftUri = await this.getNftMetaByEvent(erc1155ContractAddress, nftId);
            } catch (e) { }
        }

        // new opensea json uri pattern
        /*if(nftUri.includes("api.opensea.io")){

            nftUri = decodeURI(nftUri).replace("{id}", nftId);
            nftUri = nftUri.split("/");
            if(nftUri.length > 0 && nftUri[ nftUri.length - 1 ].startsWith("0x")){
                nftUri[ nftUri.length - 1 ] = nftUri[ nftUri.length - 1 ].replace("0x", "");
                nftUri = nftUri.join("/");
            }
        }*/

        return nftUri;
    };

    async getNftMetaByEvent(erc1155ContractAddress, nftId) {

        this.sleep(this.sleep_time);

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155ContractAddress, { from: this.account });
        let uris = await erc1155.getPastEvents('URI', {
            filter: {
                _id: nftId
            },
            fromBlock: 0,
            toBlock: 'latest'
        });
        uris = uris.reverse();
        if (uris.length > 0) {
            return uris[0].returnValues[0];
        }

        return '';
    };



}