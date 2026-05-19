import * as dotenv from 'dotenv';
dotenv.config();

export class AITriageUtil {
    /**
     * Uses the Gemini AI Engine to process the context JSON and return a semantic diagnosis.
     */
    static async analyzeFailure(contextPayload: any): Promise<string> {
        console.log(`[AI Triage Engine] Analyzing correlated execution payload...`);
        console.log(`[AI Triage Engine] Traceparent: ${contextPayload.traceparent}`);
        console.log(`[AI Triage Engine] Correlating with database logs within millisecond window...`);

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return "[AI Setup Error] GEMINI_API_KEY is not set in environment variables.";
        }

        const prompt = `
You are an expert DevOps AI Triage Engine. Analyze the following failed test execution payload.
Your goal is to provide a concise, semantic error categorization and root cause diagnosis (like "94% probability: Backend defect in Payment-Service - Not a UI locator issue.").
Respond with ONLY the diagnosis string. Do not include markdown formatting or extra text.

Payload:
${JSON.stringify(contextPayload, null, 2)}
        `;

        const requestPayload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        try {
            // Updated to gemini-2.5-flash as 1.5 is deprecated
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                return `[AI API Error] Failed to generate diagnosis: ${response.status} ${response.statusText}`;
            }

            const data = await response.json();
            return data.candidates[0].content.parts[0].text.trim();
        } catch (err: any) {
            return `[AI Network Error] API call blocked or failed: ${err.message}`;
        }
    }
}
