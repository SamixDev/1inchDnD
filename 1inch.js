const express = require('express');
require('dotenv').config()
const port = process.env.Server_Port || 1200;
const app = express();
const path = require('path');
const apiResponse = require("./APIs/apiResponse");
const router = require("./APIs/routes")

// routing APIs
app.use('/api', router);


const { getLastBlockNumber } = require("./Controllers/dbController")
getLastBlockNumber();


// serving webpage files
app.use(express.json());
app.use(express.static("Client/balnwatch/build"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/balnwatch/build/', 'index.html'), function (err) {
        if (err) {
            apiResponse.notFoundResponse(res, "404 Page not found")
        }
    });
})

// throw 404 if URL not found
app.all("*", function (req, res) {
    return apiResponse.notFoundResponse(res, "404 Page not found");
});

// start server listen and port number
app.listen(port, () => {
    console.log('Server started! At http://localhost:' + port);
});