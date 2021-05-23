const { connect } = require('../DataBase/connectSQL');

async function transactions(interval, dbName, type) {
    return new Promise((resolve, reject) => {
        let sql;
        switch (interval) {
            case "Daily":
                sql = `SELECT LEFT(block_signed_at, 10) AS date, sum(val2) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `
                break;
            case "Weekly":
                sql = `SELECT
                    LEFT(STR_TO_DATE(CONCAT(YEARWEEK(block_signed_at, 0), ' ', 'Saturday'), '%X%V %W'),10) AS date,
                    sum(val2) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    GROUP BY YEARWEEK(block_signed_at, 0)
                    ORDER BY YEARWEEK(block_signed_at, 0);`
                break;
            case "Monthly":
                sql = `SELECT LEFT(block_signed_at, 7) AS date, sum(val2) as value
                    FROM ${dbName}
                    where tx_type = '${type}'
                    group by date;
                    `;
                break;
            default:
                sql = `SELECT LEFT(block_signed_at, 7) AS date, sum(val2) as value
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
                    GROUP BY YEARWEEK(block_signed_at, 0)
                    ORDER BY YEARWEEK(block_signed_at, 0);`
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

module.exports = { transactions, transactionsNumber }