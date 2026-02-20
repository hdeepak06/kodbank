const { Client } = require("@gradio/client");

async function checkSpace() {
    try {
        console.log("Connecting to hdeepak06/kodbank-ai...");
        const client = await Client.connect("hdeepak06/kodbank-ai");
        console.log("Successfully connected!");

        // Print available endpoints
        console.log("Endpoints:", client.config.endpoints);
    } catch (err) {
        console.error("Connection Error:", err);
    }
}

checkSpace();
