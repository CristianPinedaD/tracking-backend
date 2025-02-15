const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;  // Use Railway's assigned port

// Enable CORS for all requests
const corsOptions = {
    origin: "*",  // Allow all domains (or restrict to your frontend URLs)
    methods: ["POST"],
    allowedHeaders: ["Content-Type"]
};
app.use(cors(corsOptions));
app.use(express.json());

// Tracking endpoint
app.post("/track", (req, res) => {
    const { website, timestamp, userAgent, referrer } = req.body;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    if (!website) {
        return res.status(400).json({ error: "Missing 'website' field" });
    }

    const clickData = { website, timestamp, userAgent, referrer, ip };

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
