const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Tracking endpoint
app.post("/track", (req, res) => {
    const { website, timestamp, userAgent } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    const clickData = { website, timestamp, userAgent, ip };

    console.log("Click logged:", clickData);

    // Append click data to a log file
    fs.appendFile("clicks.log", JSON.stringify(clickData) + "\n", (err) => {
        if (err) {
            console.error("Error saving click data:", err);
        }
    });

    res.sendStatus(200); // Respond to the client
});

// Start the server
app.listen(PORT, () => {
    console.log(`Tracking server running on port ${PORT}`);
});
