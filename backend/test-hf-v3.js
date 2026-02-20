async function testHF() {
    try {
        const message = "Hello";
        console.log("Testing Hugging Face Space with /call/kodbank_ai...");

        // Step 1: Initialize the call
        const response = await fetch(
            "https://hdeepak06-kodbank-ai.hf.space/call/kodbank_ai",
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

        const { event_id } = await response.json();
        console.log("Event ID:", event_id);

        // Step 2: Stream the result
        const resultResponse = await fetch(
            `https://hdeepak06-kodbank-ai.hf.space/call/kodbank_ai/${event_id}`
        );

        const text = await resultResponse.text();
        console.log("Final Event Source Text:", text);

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

testHF();
