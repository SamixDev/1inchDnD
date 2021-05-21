const { connect } = require('../DataBase/connectSQL');
const { getTransfers } = require("./tnxFetchController")
require('dotenv').config()

async function getLastBlockNumber() {
    let sql = "SELECT MAX(block_height) as max FROM transactions";
    connect(sql).then(resp => {
        if (resp[0].max == null) {
            console.log("no data")
            getTransfers(Number(process.env.STARTING_BLOCK), Number(process.env.STARTING_BLOCK) + 500000)
        } else {
            console.log("found data height ", resp[0].max)
            getTransfers(Number(resp[0].max) + 1, Number(resp[0].max) + 500000)
        }
    }).catch(err => {
        console.log(err)
    });
};

module.exports = { getLastBlockNumber }