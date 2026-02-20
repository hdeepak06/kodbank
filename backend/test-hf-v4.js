async function testHF() {
    try {
        const message = "Hello";
        console.log("Testing Hugging Face Space with /gradio_api/api/predict...");
        const hfResponse = await fetch(
            "https://hdeepak06-kodbank-ai.hf.space/gradio_api/api/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: [message],
                    api_name: "/kodbank_ai"
                })
            }
        );

        console.log("Status:", hfResponse.status);
        const result = await hfResponse.json();
        console.log("Output:", result);

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testHF();
