import express from "express";
import { createClient } from "redis";

const app = express();
app.use(express.json());

const client = createClient();
client.on('error', (err) => console.log("Redis Client Erro", err));

app.post('/submit', async (req, res) => {
    const problemId = req.body.problemId;
    const code = req.body.code;
    const language = req.body.language;   

    try {
        await client.lPush("problems", JSON.stringify({code, language, problemId}));
        res.status(200).json({
            msg: "Submission received and stored"
        })
    }catch (err) {
        console.log("Redis error", err);
        res.status(500).json({
                msg: "Failed to store submission"
        })
    }
})


async function startServer() {
    try {
        await client.connect();
        console.log("Connected to Redis");

        app.listen(3000, () => {
            console.log("Server is listening on Port 3000")
        })
    } catch(err) {
        console.log("Failed to connect to redis", err);
    }
}

startServer();