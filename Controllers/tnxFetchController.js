'use strict';
const axios = require('axios');
const { connect } = require('../DataBase/connectSQL');

async function getTransfers(starting, ending, chainId) {

    axios.get(`${process.env.COV_API}/${chainId}/events/address/
        ${process.env.CHI_ADDRESS}/?starting-block=${starting}
        &ending-block=${ending}&page-size=10000&match=
        {decoded.name:"Transfer"}&key=
        ${process.env.KEY}`, { timeout: 30000 })
        .then(response => {
            switch (chainId) {
                case 1: // eth
                    //   console.log("Fetched data on ETH ")
                    saveTnxDb(response.data.data.items, 'transactions_eth')
                    break;
                case 56: // bsc
                    //   console.log("Fetched data on BSC ")
                    saveTnxDb(response.data.data.items, 'transactions_bsc')
                    break;
                case 137: // polygon
                    //    console.log("Fetched data on POLYGON ")
                    saveTnxDb(response.data.data.items, 'transactions_pol')
                    break;
                default:
            }
        }).catch(function (error) {
            if (error.code === 'ECONNABORTED') {
                console.log(`A timeout happend on url ${error.config.url}`)
            }
        });

};

async function saveTnxDb(items, table) {

    for (let i = 0; i < items.length; i++) {
        let tx_type = await checkType(items[i].decoded.params[0].value, items[i].decoded.params[1].value);
        let date_human = `${items[i].block_signed_at.substring(0, 10)} ${items[i].block_signed_at.substring(11, 19)}`
        let sql = `insert into ${table}
        (block_signed_at, timestamp, block_height, tx_hash, tx_type, name, val0, val1, val2)
        values(
        '${items[i].block_signed_at}',
        cast(UNIX_TIMESTAMP(CONVERT_TZ('${date_human}', '+00:00',@@session.time_zone)) AS SIGNED),
        ${items[i].block_height},
        '${items[i].tx_hash}',
        '${tx_type}',
        '${items[i].decoded.name}',
        '${items[i].decoded.params[0].value}',
        '${items[i].decoded.params[1].value}',
        ${items[i].decoded.params[2].value});`
        connect(sql).then(resp => {
            //console.log("saved to db @ " + Date.now())
        }).catch(err => {
            console.log(err)
        });
    };
    var ts = new Date();
    console.log("saved " + items.length + " tnx to db " + table + " @ " + ts.toString());
}

async function checkType(val0, val1) {
    let type = "Transfer";
    if (val0 == "0x0000000000000000000000000000000000000000") {
        type = "Mint";
    } else if (val1 == "0x0000000000000000000000000000000000000000") {
        type = "Burn";
    }
    return type;
};

module.exports = { getTransfers }