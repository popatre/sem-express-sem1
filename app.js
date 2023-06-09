const fs = require("fs/promises");
const express = require("express");
const app = express();

// if someone passes a query - send them back to ones with that genre
// if they dont pass a query, send them back all songs

app.get("/api/songs", (req, res) => {
    const genre = req.query.genre;

    //get all the names of the song files
    fs.readdir(`${__dirname}/data/songs`)
        .then((fileNames) => {
            // bundle up pending reads
            const pendingPromises = fileNames.map((fileName) => {
                // read each file name (pending)
                const pendingRead = fs.readFile(
                    `${__dirname}/data/songs/${fileName}`,
                    "utf8"
                );
                return pendingRead;
            });

            return Promise.all(pendingPromises);
        })
        .then((songsData) => {
            const parsedSongs = songsData.map((song) => JSON.parse(song));

            if (genre) {
                const songsByGenre = parsedSongs.filter((song) => {
                    return song.genre === genre;
                });
                res.status(200).send({ songs: songsByGenre });
            } else {
                res.status(200).send({ songs: parsedSongs });
            }
        });
});

app.listen(9090, () => {
    console.info(`Server listening on port 9090`);
});
