const express = require('express');
const apiResponse = require("./apiResponse");
const router = express.Router();
const { transactions, transactionsNumber } = require('../Controllers/dbQuery')

router.get('/tnx', async (req, res) => {

    let chainId = req.query.chainId
    let interval = req.query.interval
    let type = req.query.type
    let dbName;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    interval === undefined ? "Monthly" : interval = interval.replace(/'|"/g, "")
    type === undefined ? "Mint" : type = type.replace(/'|"/g, "")

    switch (chainId) {
        case 1: // eth
            dbName = 'transactions_eth';
            break;
        case 56: // bsc
            dbName = 'transactions_bsc';
            break;
        case 137: // polygon
            dbName = 'transactions_pol';
            break;
        default:
            dbName = 'transactions_eth';
    }
    transactions(interval, dbName, type).then(({ data, msg }) => {
        let tot = 0;
        data.forEach(element => {
            tot += element.value
        });
        apiResponse.successResponseWithDataAndTotal(res, msg, data, tot);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});

router.get('/tnxCount', async (req, res) => {

    let chainId = req.query.chainId
    let interval = req.query.interval
    let type = req.query.type
    let dbName;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    interval === undefined ? "Monthly" : interval = interval.replace(/'|"/g, "")
    type === undefined ? "Mint" : type = type.replace(/'|"/g, "")

    switch (chainId) {
        case 1: // eth
            dbName = 'transactions_eth';
            break;
        case 56: // bsc
            dbName = 'transactions_bsc';
            break;
        case 137: // polygon
            dbName = 'transactions_pol';
            break;
        default:
            dbName = 'transactions_eth';
    }
    transactionsNumber(interval, dbName, type).then(({ data, msg }) => {
        let tot = 0;
        data.forEach(element => {
            tot += element.value
        });
        apiResponse.successResponseWithDataAndTotal(res, msg, data, tot);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});
module.exports = router;