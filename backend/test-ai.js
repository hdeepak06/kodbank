const { Client } = require("@gradio/client");

async function testAI() {
    try {
        console.log("Connecting to CohereLabs/tiny-aya...");
        const client = await Client.connect("CohereLabs/tiny-aya");

        console.log("Sending request...");
        const result = await client.predict("/generate", {
            message: "Hello!!",
            system_prompt: "Hello!!",
            temperature: 0.1,
            max_new_tokens: 700,
        });

        console.log("\n--- AI Response ---");
        console.log(result.data[0]);
        console.log("-------------------\n");
    } catch (err) {
        console.error("Error testing AI:", err);
    }
}

testAI();
