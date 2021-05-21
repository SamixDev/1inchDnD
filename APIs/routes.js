const express = require('express');
const apiResponse = require("./apiResponse");
const router = express.Router();


router.get('/tnx', async (req, res) => {
    apiResponse.successResponse(res, "hello");
});

module.exports = router;