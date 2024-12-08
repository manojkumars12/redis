import { createClient } from "redis";
const client = createClient();

async function processSubmission(submission: string) {
    const { problemId, code, language} = JSON.parse(submission);
    console.log(`Processing submission for problemId ${problemId}`);
    console.log(`code ${code}`);
    console.log(`language ${language}`);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Finished processing submission for problemId ${problemId}`);
    await client.publish("problem_done", JSON.stringify({problemId, status:"TLE"}));
}

async function startWorker() {
    try {
        await client.connect();
        console.log("Worker connected to Redis");

        while (true) {
            try {
                const submission = await client.brPop("problems", 0);
                //@ts-ignore
                await processSubmission(submission?.element);
            } catch(err) {
                console.log("Error processing Submission", err);
            }
        }
    } catch(err) {
        console.log("Failed to connect to redis", err);
    }
}
startWorker();