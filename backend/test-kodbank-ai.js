const { Client } = require("@gradio/client");

async function testKodBankAI() {
    try {
        console.log("Connecting to hdeepak06/kodbank-ai...");
        const client = await Client.connect("hdeepak06/kodbank-ai");
        console.log("Connected successfully!");

        console.log("Client config:", JSON.stringify(client.config, null, 2));

        console.log("Sending message: 'hello'...");
        const result = await client.predict("/kodbank_ai", {
            message: "hello",
        });

        console.log("\n--- AI Response ---");
        console.log(result.data[0]);
        console.log("-------------------\n");
    } catch (err) {
        console.error("Error testing AI:", err);
    }
}

testKodBankAI();
