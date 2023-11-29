const fs = require("fs/promises");
const express = require("express");
const app = express();

app.get("/api/bands", (req, res) => {
    fs.readdir("./data/bands")
        .then((fileNames) => {
            const pendingReads = fileNames.map((fileName) => {
                return fs.readFile(`./data/bands/${fileName}`);
            });
            return Promise.all(pendingReads);
        })
        .then((bands) => {
            const parsedBands = bands.map((band) => JSON.parse(band));

            res.status(200).send({ bands: parsedBands });
        });
});

//fetch songs by band number 1

app.listen(9090, () => {
    console.info(`Server listening on port 9090`);
});
