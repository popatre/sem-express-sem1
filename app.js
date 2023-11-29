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

app.get("/api/band/:id/songs", (req, res) => {
    const bandId = req.params.id;
    const includeExplicit = req.query.explicit;
    console.log(includeExplicit);

    fs.readFile(`${__dirname}/data/bands/${bandId}.json`, "utf-8").then(
        (fileContents) => {
            const parsedFile = JSON.parse(fileContents);

            const songs = parsedFile.songs;

            if (includeExplicit) {
                const queriedSongs = songs.filter((song) => {
                    return song.explicit === includeExplicit;
                });
                res.status(200).send({ songs: queriedSongs });
            } else {
                res.status(200).send({ songs: songs });
            }
        }
    );
});

app.listen(9090, () => {
    console.info(`Server listening on port 9090`);
});
