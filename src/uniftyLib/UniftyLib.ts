import Web3 from "web3";
import { erc1155ABI } from '../contracts/erc1155ABI';
import { erc20ABI } from '../contracts/erc20ABI';
import { nifABI } from '../contracts/nifABI';
import { genesisABI } from '../contracts/genesisABI';
import { farmABI } from '../contracts/farmABI';
import { farmShopABI } from '../contracts/farmShopABI';
import { createContext, useEffect } from "react";
import ipfsClient from 'ipfs-http-client'

//const web3 = createContext(new Web3(Web3.givenProvider || "ws://localhost:8545"));

export default class Unifty {
    web3: Web3;
    min_block = 0;
    sleep_time = 20;
    ipfs: any;
    nif: any;
    erc1155: any;
    genesis: any;
    farm: any;
    farmShop: any;
    account: string;
    defaultProxyRegistryAddress: string;
    constructor() {
        this.web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
        //this.web3.


        this.setParams();
        this.setAccount();
        this.createIpfsServer();

    }
    async createIpfsServer() {
        this.ipfs = ipfsClient('https://ipfs.infura.io:5001');
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
    async setParams() {
        let network = await this.web3.eth.net.getId();

        let chain_id = "" + network;
        if (chain_id === "4") {
            console.log("En Rinkeby");

            this.nif = new this.web3.eth.Contract(nifABI, '0xb93370d549a4351fa52b3f99eb5c252506e5a21e', { from: this.account });
            this.erc1155 = new this.web3.eth.Contract(erc1155ABI, '0xD329D511Bc8368Be4396Cc489B6161af1b275803', { from: this.account });
            this.genesis = new this.web3.eth.Contract(genesisABI, '0xD0B9250e4d6786ec3205E8c303eCF6FF4e8b0270', { from: this.account });
            this.farm = new this.web3.eth.Contract(farmABI, '0x9103F8A3063905DB85031a8e700EA7729504EaEA', { from: this.account });
            this.farmShop = new this.web3.eth.Contract(farmShopABI, '0xe6f337111Cb71CC1dfB92175cC0e8Cbc3F584fBA', { from: this.account });
            this.account = '';
            this.defaultProxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317'; // opensea

            // xDAI MAINNET
        } else {

            console.log("En mainnet");

            this.nif = new this.web3.eth.Contract(nifABI, '0x7e291890B01E5181f7ecC98D79ffBe12Ad23df9e', { from: this.account });
            this.erc1155 = new this.web3.eth.Contract(erc1155ABI, '0xC0B257fe1aB2C52A0d58538Dc1Aa3376C8aF69Ff', { from: this.account });
            this.genesis = new this.web3.eth.Contract(genesisABI, '0x74A73135ECD612d530B89Fb28125583ed39A5f22', { from: this.account });
            this.farm = new this.web3.eth.Contract(farmABI, '0xC4F31771928923490722bFfC484167c2d355be85', { from: this.account });
            this.farmShop = new this.web3.eth.Contract(farmShopABI, '0x3E58801d8F3379bb5090Dc742e60614bC94b1bd8', { from: this.account });
            this.account = '';
            this.defaultProxyRegistryAddress = '0xa5409ec958c83c3f309868babaca7c86dcb077c1'; // opensea

        }
    }

    async getAccount() {
        let ac = this.web3.eth.accounts.create().address;

        /* let reqac  = await this.web3.eth.requestAccounts();
 
         if(reqac != undefined){
             ac = reqac[0];
         }
 
         console.log(ac);*/

        return ac;
    }

    async setAccount() {

        this.account = await this.getAccount();

    };

    async getNetwork() {
        return await this.web3.eth.net.getId();
    }
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

        console.log("farm", farm, "Farm adddres", farmAddress);

        let cards = await farm.getPastEvents('CardAdded', {
            fromBlock: this.min_block,
            toBlock: 'latest'
        })



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
        // let balance = await erc1155.methods.balanceOf(this.account, nftId).call({ from: this.account });
        let uri = await this.getNftMeta(erc1155Address, nftId);

        return { uri: uri, supply: supply, maxSupply: maxSupply, /*/balance: balance*/ };
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

    async getNftJson(collection: string, nft: string) {

        let realNft = await this.getNft(collection, nft);
        let metaNft = await this.getNftMeta(collection, nft);
        let jsonMeta = await fetch(metaNft).then(r => r.json())
        return { nft: realNft, meta: jsonMeta, id: nft }
    }

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

    /**
     * ERC1155  // Collections
     */

    async getMyErc1155(index) {
        await this.sleep(this.sleep_time);
        let erc1155 = await this.genesis.methods.getPool(this.account, index).call({ from: this.account });
        let meta = await this.getErc1155Meta(erc1155);
        let _pool = { erc1155: erc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol };
        return _pool;
    };

    async getNftsByUri(erc1155Address) {

        await this.sleep(this.sleep_time);

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });

        let events = await erc1155.getPastEvents('URI', {
            filter: {
            },
            fromBlock: this.min_block,
            toBlock: 'latest'
        });


        let nfts = [];

        if (Array.isArray(events)) {

            events = events.reverse();

            for (let i = 0; i < events.length; i++) {

                if (typeof events[i] == 'object') {
                    if (!nfts.includes(events[i].returnValues._id)) {
                        nfts.push(events[i].returnValues._id);
                    }
                }
            }
        }

        return nfts;
    };

    async getErc1155Meta(erc1155ContractAddress) {

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155ContractAddress, { from: this.account });
        let contractURI = '';

        try {
            await this.sleep(this.sleep_time);
            contractURI = await erc1155.methods.contractURI().call({ from: this.account });
        } catch (e) {
            console.log('error retrieving contract URI: ', e);
        }

        let name = 'n/a';
        let symbol = 'n/a';

        try {
            await this.sleep(this.sleep_time);
            name = await erc1155.methods.name().call({ from: this.account });
            await this.sleep(this.sleep_time);
            symbol = await erc1155.methods.symbol().call({ from: this.account });
        } catch (e) {
            console.log('error retrieving name and symbol: ', e);
        }

        return { contractURI: contractURI, name: name, symbol: symbol };
    };
    async getPoolFee() {
        await this.sleep(this.sleep_time);
        return await this.genesis.methods.poolFee().call({ from: this.account });
    };
    async getPoolMinimumNif() {
        await this.sleep(this.sleep_time);
        return await this.genesis.methods.poolFeeMinimumNif().call({ from: this.account });
    };

    async iHaveAnyWildcard() {
        await this.sleep(this.sleep_time);
        return await this.genesis.methods.iHaveAnyWildcard().call({ from: this.account });
    };

    async newErc1155(name, ticker, contractJsonUri, proxyRegistryAddress, preCallback, postCallback, errCallback) {

        await this.sleep(this.sleep_time);
        let nif = this.web3.utils.toBN(await this.nif.methods.balanceOf(this.account).call({ from: this.account }));
        let minNif = this.web3.utils.toBN(await this.getPoolMinimumNif());

        let gas = 0;

        try {
            await this.sleep(this.sleep_time);
            gas = await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress).estimateGas({
                from: this.account,
                value: await this.iHaveAnyWildcard() || nif.gte(minNif) ? 0 : await this.getPoolFee()

            });
        } catch (e) {
            errCallback(e);
            return;
        }

        const price = await this.web3.eth.getGasPrice();

        await this.genesis.methods.newPool(name, ticker, contractJsonUri, '', proxyRegistryAddress)
            .send(
                {
                    from: this.account,
                    value:
                        await this.iHaveAnyWildcard() || nif.gte(minNif) ? 0 : await this.getPoolFee(),
                    gas: gas + Math.floor(gas * 0.1),
                    gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
                })
            .on('error', async function (e) {
                console.log(e);
                errCallback(e);
            })
            .on('transactionHash', async function (transactionHash) {
                preCallback(transactionHash);
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };



}