const express = require('express');
require('dotenv').config()
const port = process.env.Server_Port || 1200;
const app = express();
const path = require('path');
const apiResponse = require("./APIs/apiResponse");
const router = require("./APIs/routes")
const { UpdateDataEth, UpdateDataBsc, UpdateDataPol } = require("./Controllers/dbUpdate")
const { getTopHolders } = require("./Controllers/tnxFetch")

// routing APIs
app.use('/api', router);

//Update Database
function updateData() {
    console.log("------------------------------------------------")
    UpdateDataEth();
    //UpdateDataBsc();
    //UpdateDataPol();
    setTimeout(updateData, 1000 * 60 * 3);
}
updateData();

//Update tokenHolders
function updateData2() {
    getTopHolders(1);
    // getTopHolders(56);
    // getTopHolders(137);
    setTimeout(updateData2, 1000 * 60 * 30);
}
updateData2();


// serving webpage files
app.use(express.json());
app.use(express.static("Client/1inch/build"));
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '/Client/1inch/build/', 'index.html'), function (err) {
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