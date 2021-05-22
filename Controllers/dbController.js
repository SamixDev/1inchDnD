const { connect } = require('../DataBase/connectSQL');
const { getTransfers } = require("./tnxFetchController")
require('dotenv').config()

async function UpdateDataEth() {
    let sql = "SELECT MAX(block_height) as max FROM transactions_eth";
    connect(sql).then(resp => {
        if (resp[0].max == null) {
            console.log("no data on ETH")
            getTransfers(Number(process.env.STARTING_BLOCK_ETH), Number(process.env.STARTING_BLOCK_ETH) + 500000, 1)
        } else {
            console.log("found data height ", resp[0].max, " on ETH chain.")
            getTransfers(Number(resp[0].max) + 1, Number(resp[0].max) + 500000, 1)
        }
    }).catch(err => {
        console.log(err)
    });
};

async function UpdateDataBsc() {
    let sql = "SELECT MAX(block_height) as max FROM transactions_bsc";
    connect(sql).then(resp => {
        if (resp[0].max == null) {
            console.log("no data on BSC")
            getTransfers(Number(process.env.STARTING_BLOCK_BSC), Number(process.env.STARTING_BLOCK_BSC) + 500000, 56)
        } else {
            console.log("last block height in DB", resp[0].max, " on BSC chain.")
            getTransfers(Number(resp[0].max) + 1, Number(resp[0].max) + 500000, 56)
        }
    }).catch(err => {
        console.log(err)
    });
};

async function UpdateDataPol() {
    let sql = "SELECT MAX(block_height) as max FROM transactions_pol";
    connect(sql).then(resp => {
        if (resp[0].max == null) {
            console.log("no data on POLYGON")
            getTransfers(Number(process.env.STARTING_BLOCK_POL), Number(process.env.STARTING_BLOCK_POL) + 500000, 137)
        } else {
            console.log("last block height in DB", resp[0].max, " on POLYGON chain.")
            getTransfers(Number(resp[0].max) + 1, Number(resp[0].max) + 500000, 137)
        }
    }).catch(err => {
        console.log(err)
    });
};
module.exports = { UpdateDataEth, UpdateDataBsc, UpdateDataPol }