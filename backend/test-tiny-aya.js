const { Client } = require("@gradio/client");

async function run() {
    try {
        console.log("Connecting...");
        const client = await Client.connect("CohereLabs/tiny-aya");
        console.log("Connected. Predicting...");
        const result = await client.predict("/generate", {
            message: "Hello",
            system_prompt: "You are a bot",
            temperature: 0.1,
            max_new_tokens: 300
        });
        console.log("Result type:", typeof result.data);
        console.log("Result length:", result.data.length);
        console.log("Result data:", JSON.stringify(result.data, null, 2));
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
