const express = require('express');
const apiResponse = require("./apiResponse");
const router = express.Router();
const { transactions, transactionsNumber, allTransactions } = require('../Controllers/dbQuery')
const axios = require('axios');
require('dotenv').config();

router.get('/allTnx', async (req, res) => {

    let chainId = req.query.chainId
    let interval = req.query.interval
    let dbName;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    interval === undefined ? "Monthly" : interval = interval.replace(/'|"/g, "")

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
    allTransactions(interval, dbName).then(({ data, count, msg }) => {

        let totalMint = 0;
        let totalBurn = 0;
        let totalTransfer = 0;
        data.forEach(element => {
            totalMint += element.mint
            totalBurn += element.burn
            totalTransfer += element.transfer
        });

        let totalMintCount = 0;
        let totalBurnCount = 0;
        let totalTransfeCount = 0;
        count.forEach(element => {
            totalMintCount += element.mint
            totalBurnCount += element.burn
            totalTransfeCount += element.transfer
        });

        apiResponse.successResponseWithDataAndAllTotalsAndCounts(res, msg, data, count,
            totalMint, totalBurn, totalTransfer,
            totalMintCount, totalBurnCount, totalTransfeCount);

    }).catch(err => {
        console.log("error")
        apiResponse.ErrorResponse(err)
    })
});

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

router.get('/stats', async (req, res) => {
    axios.get(`${process.env.COV_API}/pricing/tickers/?tickers=chi&key=${process.env.KEY}`
        , { timeout: 30000 })
        .then(response => {
            if (response.data && response.data.data && response.data.data.items[0]) {
                let stats = {
                    price: Number((response.data.data.items[0].quote_rate).toFixed(5)),
                    rank: response.data.data.items[0].rank
                }
                let msg = "Data Found"
                apiResponse.successResponseWithData(res, msg, stats);
            } else {
                let msg = "Data Unavailable"
                apiResponse.successResponseWithData(error, msg, { price: 0, rank: 0 })
            }

        }).catch(function (error) {
            if (error.code === 'ECONNABORTED') {
                console.log(`A timeout happend on url ${error.config.url}`)
            }
            let msg = "ERROR"
            apiResponse.ErrorResponse(error, msg)
        });
});

module.exports = router;