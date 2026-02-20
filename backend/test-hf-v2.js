async function testHF() {
    try {
        const message = "Hello";
        console.log("Testing Hugging Face Space fetch with /api/predict...");
        const hfResponse = await fetch(
            "https://hdeepak06-kodbank-ai.hf.space/api/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: [message],
                    fn_index: 0, // Often required for Gradio
                    session_hash: "test_session" // Often required for Gradio
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
