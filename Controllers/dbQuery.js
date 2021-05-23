const { connect } = require('../DataBase/connectSQL');

async function transactions(intervalQuery, dbName, type) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT ${intervalQuery} AS date, sum(val2) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `

        connect(sql).then(resp => {
            if (resp == '') {
                resolve({ data: [], msg: "No Data" })
            } else {
                resolve({ data: resp, msg: "Data Found" })
            }
        }).catch(err => {
            console.log(err)
            reject(err)
        });
    });
};

async function transactionsNumber(intervalQuery, dbName, type) {
    return new Promise((resolve, reject) => {
        // let sql = `SELECT ${intervalQuery} AS date, sum(val2) as value
        //             FROM ${dbName}
        //             where tx_type = '${type}'
        //             group by date;
        //             `

        // connect(sql).then(resp => {
        //     if (resp == '') {
        //         resolve({ data: [], msg: "No Data" })
        //     } else {
        //         resolve({ data: resp, msg: "Data Found" })
        //     }
        // }).catch(err => {
        //     console.log(err)
        //     reject(err)
        // });
    });
};

module.exports = { transactions, transactionsNumber }