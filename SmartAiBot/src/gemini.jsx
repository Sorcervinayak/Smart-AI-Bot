import { prevUser } from "./context/UserContext";

const API_Url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${import.meta.env.VITE_GEMINI_KEY}`;

export async function generateResponse() {
    if (!prevUser || !prevUser.prompt) {
        console.error("prevUser or prevUser.prompt is undefined");
        return null;
    }

    let requestBody = {
        "contents": [
            {
                "parts": [
                    {
                        "text": prevUser.prompt
                    },
                    ...(prevUser.data ? [{
                        "inline_data": {
                            "mime_type": prevUser.mime_type,
                            "data": prevUser.data
                        }
                    }] : [])
                ]
            }
        ]
    };

    let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
    };

    try {
        let response = await fetch(API_Url, requestOptions);
        let data = await response.json();

        if (!data.candidates || !data.candidates[0]?.content?.parts[0]?.text) {
            console.error("Invalid API response:", data);
            return null;
        }

        let apiResponse = data.candidates[0].content.parts[0].text
            .replace(/\*\*(.*?)\*\*/g, "$1")
            .trim();

        return apiResponse;
    } catch (error) {
        console.error("Error in generateResponse:", error);
        return null;
    }
}
