const express = require('express');
const apiResponse = require("./apiResponse");
const router = express.Router();
const { transactions, transactionsNumber } = require('../Controllers/dbQuery')

router.get('/tnx', async (req, res) => {

    let chainId = req.query.chainId
    let interval = req.query.interval
    let type = req.query.type
    let dbName;
    let intervalQuery;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    interval === undefined ? "monthly" : interval = interval.replace(/'|"/g, "")
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
    switch (interval) {
        case "Daily":
            intervalQuery = 'LEFT(block_signed_at, 10)';
            break;
        case "Weekly":
            intervalQuery = 'LEFT(block_signed_at, 9)'; // change later
            break;
        case "Monthly":
            intervalQuery = 'LEFT(block_signed_at, 7)';
            break;
        default:
            intervalQuery = 'LEFT(block_signed_at, 7)';
    }
    transactions(intervalQuery, dbName, type).then(({ data, msg }) => {
        apiResponse.successResponseWithData(res, msg, data);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});

router.get('/tnxCount', async (req, res) => {

    let chainId = req.query.chainId
    let interval = req.query.interval
    let type = req.query.type
    let dbName;
    let intervalQuery;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    interval === undefined ? "monthly" : interval = interval.replace(/'|"/g, "")
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
    switch (interval) {
        case "Daily":
            intervalQuery = 'LEFT(block_signed_at, 10)';
            break;
        case "Weekly":
            intervalQuery = 'LEFT(block_signed_at, 9)'; // change later
            break;
        case "Monthly":
            intervalQuery = 'LEFT(block_signed_at, 7)';
            break;
        default:
            intervalQuery = 'LEFT(block_signed_at, 7)';
    }
    transactionsNumber(intervalQuery, dbName, type).then(({ data, msg }) => {
        apiResponse.successResponseWithData(res, msg, data);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});
module.exports = router;