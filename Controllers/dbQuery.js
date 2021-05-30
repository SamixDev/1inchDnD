const { connect } = require('../DataBase/connectSQL');
const axios = require('axios');

// all transactions for a specific chainID
async function allTransactions(interval, dbName) {
    const promise1 = new Promise((resolve, reject) => {
        transactions(interval, dbName, "Mint").then(result => {
            let finalRes = [];
            if (result.data.length > 0) {
                result.data.forEach(element => {
                    finalRes.push({ date: element.date, valueMint: element.value, count: element.count })
                });
            }
            resolve(finalRes)
        })

    });
    const promise2 = new Promise((resolve, reject) => {
        transactions(interval, dbName, "Burn").then(result => {
            let finalRes = [];
            if (result.data.length > 0) {
                result.data.forEach(element => {
                    finalRes.push({ date: element.date, valueBurn: element.value, count: element.count })
                });
            }
            resolve(finalRes)
        })
    });
    const promise3 = new Promise((resolve, reject) => {
        transactions(interval, dbName, "Transfer").then(result => {
            let finalRes = [];
            if (result.data.length > 0) {
                result.data.forEach(element => {
                    finalRes.push({ date: element.date, valueTransfer: element.value, count: element.count })
                });
            }
            resolve(finalRes)
        })
    });
    let vals = await Promise.all([promise1, promise2, promise3]).then((values) => {

        // join all arrays
        let allVals = [...values[0], ...values[1], ...values[2]];
        // get all unique dates
        const uniqueDate = [...new Set(allVals.map(item => item.date))];
        uniqueDate.sort();

        // create new values
        let newVals = [];
        let newCounts = [];
        uniqueDate.forEach(element => {
            newVals.push({ date: element, mint: 0, burn: 0, transfer: 0 })
            newCounts.push({ date: element, mint: 0, burn: 0, transfer: 0 })
        });

        // merge unique dates with new values
        for (let i = 0; i < allVals.length; i++) {
            let idx = newVals.findIndex(el => el.date == allVals[i].date)
            newVals[idx].mint += allVals[i].valueMint ? allVals[i].valueMint : 0;
            newVals[idx].burn += allVals[i].valueBurn ? allVals[i].valueBurn : 0;
            newVals[idx].transfer += allVals[i].valueTransfer ? allVals[i].valueTransfer : 0;

            let idx2 = newCounts.findIndex(el => el.date == allVals[i].date)
            newCounts[idx2].mint += allVals[i].valueMint ? allVals[i].count : 0;
            newCounts[idx2].burn += allVals[i].valueBurn ? allVals[i].count : 0;
            newCounts[idx2].transfer += allVals[i].valueTransfer ? allVals[i].count : 0;

        }

        return [newVals, newCounts];

    }).catch(err => {
        console.log(err)
        reject(err)
    });

    if (vals[0].length > 0 && vals[1].length > 0) {
        return ({
            data: vals[0],
            count: vals[1],
            msg: "Found Data"
        });
    } else {
        return ({ data: [], msg: "No Data" });
    }

};

// number of token holders who burned and minted chi
async function holdersBMT(dbName, dbName2) {
    // burned
    const promise1 = new Promise((resolve, reject) => {
        let sql;
        sql = `SELECT  count(DISTINCT val0) as holders
                FROM ${dbName}
                where val1 = '0x0000000000000000000000000000000000000000'`
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

    //minted
    const promise2 = new Promise((resolve, reject) => {
        let sql;
        sql = `SELECT  count(DISTINCT val1) as holders
                FROM ${dbName}
                where val0 = '0x0000000000000000000000000000000000000000'`
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

    // transferred
    const promise3 = new Promise((resolve, reject) => {
        let sql;
        sql = `SELECT count(DISTINCT val0) as holders1,count(DISTINCT val1) as holders2
                FROM ${dbName}
                where val0 <> '0x0000000000000000000000000000000000000000' and val1 <> '0x0000000000000000000000000000000000000000'`
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

    // holders
    const promise4 = new Promise((resolve, reject) => {
        let sql;
        sql = `SELECT value
            FROM allholders where name = '${dbName2}';`
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

    let vals = await Promise.all([promise1, promise2, promise3, promise4]).then((values) => {

        return ({
            holders_burned: values[0].data[0].holders,
            holders_minted: values[1].data[0].holders,
            holders_transferred: values[2].data[0].holders1 + values[2].data[0].holders2,
            holders: Number(values[3].data[0].value)
        });

    }).catch(err => {
        console.log(err)
        reject(err)
    });

    return ({
        data: vals,
        msg: "Found Data"
    });
};


// top 10 token holders
async function top10(dbName) {
    return new Promise((resolve, reject) => {
        let sql;
        sql = `SELECT address, convert(balance, SIGNED) as balance, total_supply
                FROM ${dbName}  order by balance desc ;`
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

// Specific transactions for a specific chainID
async function transactions(interval, dbName, type) {
    return new Promise((resolve, reject) => {
        let sql;
        switch (interval) {
            case "Daily":
                sql = `SELECT LEFT(block_signed_at, 10) AS date, sum(val2) as value, count(*) as count
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date
                    order by date;
                    `
                break;
            case "Weekly":
                sql = `SELECT
                    LEFT(STR_TO_DATE(CONCAT(YEARWEEK(block_signed_at, 0), ' ', 'Saturday'), '%X%V %W'),10) AS date,
                    sum(val2) as value, count(*) as count
                    FROM ${dbName}
                    where tx_type = '${type}'
                    GROUP BY date
                    ORDER BY date;`
                break;
            case "Monthly":
                sql = `SELECT LEFT(block_signed_at, 7) AS date, sum(val2) as value, count(*) as count
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date
                    order by date;
                    `;
                break;
            default:
                sql = `SELECT LEFT(block_signed_at, 7) AS date, sum(val2) as value, count(*) as count
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date
                    order by date;
                    `;
        }

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

// number of transactions for a specific chainID and type
async function transactionsNumber(interval, dbName, type) {
    return new Promise((resolve, reject) => {
        let sql;
        switch (interval) {
            case "Daily":
                sql = `SELECT LEFT(block_signed_at, 10) AS date, count(*) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `
                break;
            case "Weekly":
                sql = `SELECT
                    LEFT(STR_TO_DATE(CONCAT(YEARWEEK(block_signed_at, 0), ' ', 'Saturday'), '%X%V %W'),10) AS date,
                    count(*) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    GROUP BY date
                    ORDER BY date;`
                break;
            case "Monthly":
                sql = `SELECT LEFT(block_signed_at, 7) AS date, count(*) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `;
                break;
            default:
                sql = `SELECT LEFT(block_signed_at, 7) AS date, count(*) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `;
        }
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

//all CHI prices
async function allPrices() {
    const promise1 = new Promise((resolve, reject) => {
        axios.get(`${process.env.COV_API}/pricing/historical_by_addresses_v2/1/usd/${process.env.CHI_ADDRESS}/?key=${process.env.KEY}`
            , { timeout: 30000 })
            .then(response => {
                resolve({ chainId: 1, price: response.data.data[0].prices[0].price })
            }).catch(err => {
                reject("error")
            });
    });
    const promise2 = new Promise((resolve, reject) => {
        axios.get(`${process.env.COV_API}/pricing/historical_by_addresses_v2/56/usd/${process.env.CHI_ADDRESS}/?key=${process.env.KEY}`
            , { timeout: 30000 })
            .then(response => {
                resolve({ chainId: 56, price: response.data.data[0].prices[0].price })
            }).catch(err => {
                reject("error")
            });
    });
    const promise3 = new Promise((resolve, reject) => {
        axios.get(`${process.env.COV_API}/pricing/historical_by_addresses_v2/137/usd/${process.env.CHI_ADDRESS}/?key=${process.env.KEY}`
            , { timeout: 30000 })
            .then(response => {
                resolve({ chainId: 137, price: response.data.data[0].prices[0].price })
            }).catch(err => {
                reject("error")
            });
    });
    let vals = await Promise.all([promise1, promise2, promise3]).then((values) => {

        return values;

    }).catch(err => {
        console.log(err)
        reject(err)
    });

    return ({
        data: vals,
        msg: "Found Data"
    });
};

module.exports = { transactions, transactionsNumber, allTransactions, holdersBMT, top10, allPrices }