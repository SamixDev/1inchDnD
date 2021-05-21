const axios = require('axios');
const { connect } = require('../DataBase/connectSQL');

function getTransfers(starting, ending) {

    axios.get(`${process.env.COV_API}events/address/
        ${process.env.CHI_ADDRESS}/?starting-block=${starting}
        &ending-block=${ending}&match=
        {decoded.name:"Transfer"}&key=
        ${process.env.KEY}`)
        .then(response => {
            console.log(response.data);
            saveTnxDb(response.data.data.items)
        });

}

function saveTnxDb(items) {

    for (let i = 0; i < items.length; i++) {
        let tx_type = checkType(items[i].decoded.params[0].value, items[i].decoded.params[1].value);
        let date_human = `${items[i].block_signed_at.substring(0, 10)} ${items[i].block_signed_at.substring(11, 19)}`
        let sql = `insert into transactions
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
            console.log("saved to db @ " + Date.now())
        }).catch(err => {
            console.log(err)
        });
    }
}

function checkType(val0, val1) {
    let type = "Transfer";
    if (val0 == "0x0000000000000000000000000000000000000000") {
        type = "Mint";
    } else if (val1 == "0x0000000000000000000000000000000000000000") {
        type = "Burn";
    }
    return type;
}

module.exports = { getTransfers }