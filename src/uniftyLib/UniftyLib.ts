import Web3 from "web3";
const erc1155ABI = require('../contracts/erc1155ABI.json');
const erc20ABI = require('../contracts/erc20ABI.json');
const nifABI = require('../contracts/nifABI.json');
const genesisABI = require('../contracts/genesisABI.json');
const farmABI = require('../contracts/farmABI.json');
const farmShopABI = require('../contracts/farmShopABI.json');
import { createContext, useEffect } from "react";
import ipfsClient from 'ipfs-http-client'
import { ClientOptions } from "ipfs-http-client/src/lib/core";
import { IFarmData } from "../hooks/useCardInfo";

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
    tacoshiFarm: string;
    rabbitFarm: string;
    chain_id: string;
    hasWallet: boolean;

    constructor() {
        this.init();

    }
    init() {
        this.web3 = new Web3(Web3.givenProvider || "wss://mainnet.infura.io/ws/v3/1d43a65747d946959cbf2c8cb67553b8");
        this.hasWallet = this.web3.givenProvider != undefined ? true : false;
        this.setAccount();
        this.setParams();
        this.createIpfsServer();
    }
    async createIpfsServer() {
        let options: ClientOptions = { url: "https://ipfs.infura.io:5001" }
        this.ipfs = ipfsClient(options);
    }
    async isConnected() {
        var ab;
        try {
            if (this.hasWallet) {
                let ac = await this.web3.eth.requestAccounts();
                ab = ac[0];
            } else {
                return false;
            }


            //return true;
        } catch (e) {

        }
        if (ab == undefined) {
            return false;
        } else {
            return true;
        }

        return false;

    }
    async setParams() {
        let network = await this.web3.eth.net.getId();

        this.chain_id = "" + network;
        if (this.chain_id === "4") {
            console.log("En Rinkeby");

            this.nif = new this.web3.eth.Contract(nifABI, '0xb93370d549a4351fa52b3f99eb5c252506e5a21e', { from: this.account });
            this.erc1155 = new this.web3.eth.Contract(erc1155ABI, '0xD329D511Bc8368Be4396Cc489B6161af1b275803', { from: this.account });
            this.genesis = new this.web3.eth.Contract(genesisABI, '0xD0B9250e4d6786ec3205E8c303eCF6FF4e8b0270', { from: this.account });
            this.farm = new this.web3.eth.Contract(farmABI, '0x9103F8A3063905DB85031a8e700EA7729504EaEA', { from: this.account });
            this.farmShop = new this.web3.eth.Contract(farmShopABI, '0xe6f337111Cb71CC1dfB92175cC0e8Cbc3F584fBA', { from: this.account });
            this.account = '';
            this.defaultProxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317'; // opensea
            this.rabbitFarm = "0x6200fD0aB93A50fC3b1EF2692Aad8A6b4C8835c0";
            this.tacoshiFarm = "0xb04f44e15d76b111001D339c60A5AC09B7767571";

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
            this.rabbitFarm = "0xe567c8eE1C362C6CfCb217e43aCfd0F68dC456F2";
            this.tacoshiFarm = "0xA6fBbE582D41c6ebbb4ad5803793dcce8662C910";

        }
    }

    getCoinName(address: string) {
        if (address == this.tacoshiFarm) {
            return "Lemon"
        }

        if (address == this.rabbitFarm) {
            return "Chile"
        }
    }

    async getAccount() {
        let ac;
        if (this.account == "") {
            ac = this.web3.eth.accounts.create().address;
            console.log("Created account cuz is undefined")
        }
        let reqac = await this.web3.eth.requestAccounts();

        if (reqac != undefined) {
            ac = reqac[0];
        }
        return ac;
    }
    getFarmAddress(isTaco) {
        return isTaco ? this.rabbitFarm : this.tacoshiFarm;
    }

    async setAccount() {
        this.account = await this.getAccount();
    };

    async getNetwork() {
        return await this.web3.eth.net.getId();
    }
    async readUri(uri) {
        if (uri != undefined) {
            let jsonMeta = await fetch(uri).then(r => r.json()).catch(e => { if (e != undefined) console.error("Error reading uri") })
            return jsonMeta;
        }
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    resolveNumberString(number, decimals) {

        let splitted = number.split(".");
        if (splitted.length == 1 && decimals > 0) {
            splitted[1] = '';
        }
        if (splitted.length > 1) {
            let size = decimals - splitted[1].length;
            for (let i = 0; i < size; i++) {
                splitted[1] += "0";
            }
            number = "" + (splitted[0] == 0 ? '' : splitted[0]) + splitted[1];
            if (parseInt(number) == 0) {
                number = "0";
            }
        }

        return number;
    };

    formatNumberString(string, decimals) {

        let pos = string.length - decimals;

        if (decimals == 0) {
            // nothing
        } else
            if (pos > 0) {
                string = string.substring(0, pos) + "." + string.substring(pos, string.length);
            } else {
                string = '0.' + ("0".repeat(decimals - string.length)) + string;
            }

        return string
    };
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

    async farmPointsEarned(farmAddress, account) {
        try {
            await this.sleep(this.sleep_time);
            let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
            let earned = await farm.methods.earned(account).call({ from: this.account });
            let decimals = await this.farmTokenDecimals(farmAddress);
            return earned / Math.pow(10, decimals >= 0 ? decimals : 0);
        } catch (e) {
            console.error(e);
        }

    };
    async farmShopGetPrice(shopAddress, erc1155Address, id) {
        await this.sleep(this.sleep_time);
        let shop = new this.web3.eth.Contract(farmShopABI, shopAddress, { from: this.account });

        let ret = await shop.methods.getPrice(erc1155Address, id).call({ from: this.account });
        return ret;
    };

    async farmTokenDecimals(farmAddress) {
        let farm_token = await this.farmToken(farmAddress);
        let erc20 = new this.web3.eth.Contract(erc20ABI, farm_token, { from: this.account });
        await this.sleep(this.sleep_time);
        return await erc20.methods.decimals().call({ from: this.account });
    };
    async farmNftData(farmAddress, erc1155Address, id):Promise<IFarmData> {
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

    async getFarmNfts(farmAddress):Promise<IFarmData[]> {

        return await this.getFarmNftsToBlock(farmAddress, this.min_block, "latest")
    };
    async getFarmNftsToBlock(farmAddress, minBlock, toBlock):Promise<IFarmData[]> {
        try {
            await this.sleep(this.sleep_time);

            let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });

            let cards = await farm.getPastEvents('CardAdded', {
                fromBlock: minBlock,
                toBlock: toBlock
            })



            let check_entries = [];
            cards = cards.reverse();
            let card_data:IFarmData[] = [];

            let decimals = await this.farmTokenDecimals(farmAddress);

            for (let i = 0; i < cards.length; i++) {

                if (check_entries.includes(cards[i].returnValues.erc1155 + cards[i].returnValues.card)) {
                    continue;
                }

                let data = await this.farmNftData(farmAddress, cards[i].returnValues.erc1155, cards[i].returnValues.card);
                console.log("AAAAAAAA",data)

                card_data.push(
                    {
                        erc1155: cards[i].returnValues.erc1155,
                        id: cards[i].returnValues.card,
                        points: Number(data.points / Math.pow(10, decimals >= 0 ? decimals : 0)).toFixed(8),
                        pointsRaw: data.points / Math.pow(10, decimals >= 0 ? decimals : 0),
                        mintFee: this.web3.utils.toBN(data.controllerFee).add(this.web3.utils.toBN(data.mintFee)).toString(),
                        artist: data.artist,
                        releaseTime: data.releaseTime,
                        nsfw: data.nsfw,
                        shadowed: data.shadowed,
                        farmAddress: farmAddress
                    }
                );

                check_entries.push(cards[i].returnValues.erc1155 + cards[i].returnValues.card);
            }

            return card_data;
        } catch (e) {
            console.log(e);
        }


    };

    async farmBalanceOf(farmAddress, account) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let balance = await farm.methods.balanceOf(account).call({ from: this.account });
        let decimals = await this.farmTokenDecimals(farmAddress);
        return balance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };
    async farmBalanceOfRaw(farmAddress, account) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let balance = await farm.methods.balanceOf(account).call({ from: this.account });
        return balance;
    };

    async farmMaxStakeRaw(farmAddress) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let max = await farm.methods.maxStake().call({ from: this.account });
        return max;
    };
    async farmMinStakeRaw(farmAddress) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let max = await farm.methods.minStake().call({ from: this.account });
        return max;
    };
    async farmMaxStake(farmAddress) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let max = await farm.methods.maxStake().call({ from: this.account });
        let decimals = await this.farmTokenDecimals(farmAddress);
        return max / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    async farmMinStake(farmAddress) {
        await this.sleep(this.sleep_time);
        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });
        let max = await farm.methods.minStake().call({ from: this.account });
        let decimals = await this.farmTokenDecimals(farmAddress);
        return max / Math.pow(10, decimals >= 0 ? decimals : 0);
    };

    async allowanceErc20(erc20Address, owner, spender) {
        await this.sleep(this.sleep_time);
        let erc20 = new this.web3.eth.Contract(erc20ABI, erc20Address, { from: this.account });
        let decimals = await erc20.methods.decimals().call({ from: this.account });
        await this.sleep(this.sleep_time);
        let allowance = await erc20.methods.allowance(owner, spender).call({ from: this.account });
        return allowance / Math.pow(10, decimals >= 0 ? decimals : 0);
    };
    async allowanceErc20Raw(erc20Address, owner, spender) {
        await this.sleep(this.sleep_time);
        let erc20 = new this.web3.eth.Contract(erc20ABI, erc20Address, { from: this.account });
        let allowance = await erc20.methods.allowance(owner, spender).call({ from: this.account });
        return allowance;
    };
    async approveErc20(erc20Address, amount, spender, preCallback, postCallback, errCallback) {

        console.log("Approve amount", amount);

        let erc20 = new this.web3.eth.Contract(erc20ABI, erc20Address, { from: this.account });

        await this.sleep(this.sleep_time);
        const gas = await erc20.methods.approve(spender, "" + amount).estimateGas({
            from: this.account,
        });
        const price = await this.web3.eth.getGasPrice();

        erc20.methods.approve(spender, "" + amount)
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                errCallback(e);
            })
            .on('transactionHash', async function (transactionHash) {
                preCallback(transactionHash);
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };
    async farmStake(farmAddress, amount, preCallback, postCallback, errCallback) {

        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });

        console.log("stake amount", amount);

        let gas = 0;
        try {
            await this.sleep(this.sleep_time);
            gas = await farm.methods.stake("" + amount).estimateGas({
                from: this.account,
            });
        } catch (e) {
            errCallback(e);
            return;
        }

        const price = await this.web3.eth.getGasPrice();

        farm.methods.stake("" + amount)
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                errCallback(e);
            })
            .on('transactionHash', async function (transactionHash) {
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };
    async farmUnstake(farmAddress, amount, preCallback, postCallback, errCallback) {

        let farm = new this.web3.eth.Contract(farmABI, farmAddress, { from: this.account });

        let gas = 0;

        try {
            await this.sleep(this.sleep_time);
            gas = await farm.methods.withdraw("" + amount).estimateGas({
                from: this.account,
            });
        } catch (e) {
            errCallback(e);
            return;
        }

        const price = await this.web3.eth.getGasPrice();

        farm.methods.withdraw("" + amount)
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                errCallback(e);
            })
            .on('transactionHash', async function (transactionHash) {
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };
    async balanceOfErc20Raw(erc20Address, owner) {
        await this.sleep(this.sleep_time);
        let erc20 = new this.web3.eth.Contract(erc20ABI, erc20Address, { from: this.account });
        let balance = await erc20.methods.balanceOf(owner).call({ from: this.account });
        return balance;
    };

    /**
     * Nfts
     */

    async balanceOf(erc1155Address, account, nftId) {

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });
        return await erc1155.methods.balanceOf(account, nftId).call({ from: this.account });
    };

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
    async newNft(supply, maxSupply, jsonUrl, erc1155Address, preCallback, postCallback, errCallback) {

        console.log('address: ', erc1155Address);

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });

        await this.sleep(this.sleep_time);
        const gas = await erc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, this.web3.utils.fromAscii('')).estimateGas({
            from: this.account,
        });
        const price = await this.web3.eth.getGasPrice();

        erc1155.methods.create(parseInt(maxSupply), parseInt(supply), jsonUrl, this.web3.utils.fromAscii(''))
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function (transactionHash) {
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    /**
     * ERC1155  // Collections
     */

    async getMyErc1155(index) {
        await this.sleep(this.sleep_time);
        if (this.genesis != undefined && this.account != "") {
            let erc1155 = await this.genesis.methods.getPool(this.account, index).call({ from: this.account });
            // console.log(erc1155);
            let meta = await this.getErc1155Meta(erc1155);
            let _pool = { erc1155: erc1155, contractURI: meta.contractURI, name: meta.name, symbol: meta.symbol };
            return _pool;
        }

    };

    async getMyErc1155Length() {
        await this.sleep(this.sleep_time);
        return await this.genesis.methods.getPoolsLength(this.account).call({ from: this.account });
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

    async getErc1155Owner(address) {

        try {
            await this.sleep(this.sleep_time);
            let erc1155 = new this.web3.eth.Contract(erc1155ABI, address, { from: this.account });
            let owner = await erc1155.methods.owner().call({ from: this.account })

            return owner;
        } catch (e) {
            console.error(e);
        }



    }

    async getErc1155Meta(erc1155ContractAddress) {
        if (erc1155ContractAddress != undefined || erc1155ContractAddress != "") {


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
        }
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

    async updateUri(nftId, jsonUrl, erc1155Address, preCallback, postCallback, errCallback) {

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });

        await this.sleep(this.sleep_time);
        const gas = await erc1155.methods.updateUri(parseInt(nftId), jsonUrl).estimateGas({
            from: this.account,
        });
        const price = await this.web3.eth.getGasPrice();

        erc1155.methods.updateUri(parseInt(nftId), jsonUrl)
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                console.log(e);
                errCallback(e);
            })
            .on('transactionHash', async function (transactionHash) {
                console.log('hash', transactionHash);
                preCallback(transactionHash);
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };

    async setContractURI(erc1155Address, uri, preCallback, postCallback, errCallback) {

        let erc1155 = new this.web3.eth.Contract(erc1155ABI, erc1155Address, { from: this.account });

        await this.sleep(this.sleep_time);
        let balanceOf = await this.nif.methods.balanceOf(this.account).call({ from: this.account });

        await this.sleep(this.sleep_time);
        const gas = await erc1155.methods.setContractURI(uri).estimateGas({
            from: this.account
        });
        const price = await this.web3.eth.getGasPrice();

        await erc1155.methods.setContractURI(uri)
            .send({
                from: this.account,
                gas: gas + Math.floor(gas * 0.1),
                gasPrice: Number(price) + Math.floor(Number(price) * 0.1)
            })
            .on('error', async function (e) {
                console.log(e);
                errCallback();
            })
            .on('transactionHash', async function (transactionHash) {
                console.log('hash', transactionHash);
                preCallback();
            })
            .on("receipt", function (receipt) {
                postCallback(receipt);
            });
    };



}