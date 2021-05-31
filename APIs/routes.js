const express = require('express');
const apiResponse = require("./apiResponse");
const router = express.Router();
const { transactions, transactionsNumber, allTransactions, holdersBMT, top10, allPrices, stats } = require('../Controllers/dbQuery')
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

router.get('/holdersNumber', async (req, res) => {

    let chainId = req.query.chainId
    let dbName;
    let dbName2;
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))

    switch (chainId) {
        case 1: // eth
            dbName = 'transactions_eth';
            dbName2 = 'ETH';
            break;
        case 56: // bsc
            dbName = 'transactions_bsc';
            dbName2 = 'BSC';
            break;
        case 137: // polygon
            dbName = 'transactions_pol';
            dbName2 = 'POL';
            break;
        default:
            dbName = 'transactions_eth';
            dbName2 = 'ETH';
    }
    holdersBMT(dbName, dbName2).then(({ data, msg }) => {
        apiResponse.successResponseWithData(res, msg, data);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});

router.get('/top10', async (req, res) => {

    let chainId = req.query.chainId
    chainId === undefined ? 1 : chainId = Number(chainId.replace(/'|"/g, ""))
    switch (chainId) {
        case 1: // eth
            dbName = 'holders_eth';
            break;
        case 56: // bsc
            dbName = 'holders_bsc';
            break;
        case 137: // polygon
            dbName = 'holders_pol';
            break;
        default:
            dbName = 'holders_eth';
    }
    top10(dbName).then(({ data, msg }) => {
        if (!(data == '')) {
            let newHolders = [];
            const totalSupply = data[0].total_supply;
            data.forEach(element => {
                newHolders.push({
                    address: element.address,
                    balance: element.balance,
                    ratio: Number((element.balance * 100 / element.total_supply).toFixed(2))
                })
            });
            apiResponse.successResponseWithDataAndTotalSupply(res, msg, newHolders, totalSupply);
        } else {
            apiResponse.successResponseWithDataAndTotalSupply(res, msg, data, 0);
        }

    }).catch(err => {
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

router.get('/prices', async (req, res) => {
    allPrices().then(({ data, msg }) => {
        apiResponse.successResponseWithData(res, msg, data);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});

// chi price and stats on eth
router.get('/stats', async (req, res) => {
    stats().then(({ data, msg }) => {
        apiResponse.successResponseWithData(res, msg, data);
    }).catch(err => {
        apiResponse.ErrorResponse(err)
    })
});

module.exports = router;