async function testHF() {
    try {
        const message = "Hello";
        console.log("Testing Hugging Face Space fetch...");
        const hfResponse = await fetch(
            "https://hdeepak06-kodbank-ai.hf.space/run/predict",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    data: [message]
                })
            }
        );

        console.log("Status:", hfResponse.status);
        const text = await hfResponse.text();
        console.log("Full Response:", text);

        try {
            const json = JSON.parse(text);
            console.log("JSON Output:", json);
        } catch (e) {
            console.log("Response is not JSON");
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testHF();
