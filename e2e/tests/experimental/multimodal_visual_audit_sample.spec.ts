import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import SauceDemoLoginPage from '../../support/pages/SauceDemoLoginPage';

// Load environment variables from .env file
dotenv.config();

// Load configuration to dynamically retrieve sauceDemoUrl
const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const sauceDemoUrl = config.application.sauceDemoUrl || config.application.sauceDemo;

test.describe('2. Multimodal Visual Auditing (AI UI Reviewer)', () => {

    /**
     * Implements a TRUE Multimodal AI Visual Audit using Google's Gemini Vision API.
     * Takes the screenshot binary buffer, converts it to base64, and sends it to the LLM.
     * Make sure your GEMINI_API_KEY is defined in your .env file or system variables!
     */
    async function aiVisualAuditAgent(page: any, screenshotBuffer: Buffer, prompt: string): Promise<{ passed: boolean, findings: string[] }> {
        console.log(`🤖 AI Vision Agent Prompt: "${prompt}"`);

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.warn(`⚠️ GEMINI_API_KEY is not set in environment variables.`);
            console.warn(`⚠️ Please add GEMINI_API_KEY to your .env file to enable real AI Visual Auditing.`);
            // Fallback for demonstration if API key is not present
            return {
                passed: false,
                findings: ['[SIMULATED FAILURE] Missing GEMINI_API_KEY. Real AI vision request aborted.']
            };
        }

        console.log(`📸 Sending screenshot (${screenshotBuffer.length} bytes) to Gemini 1.5 Flash Vision API...`);
        const base64Image = screenshotBuffer.toString('base64');

        // Construct the HTTP payload for Gemini Vision
        const payload = {
            contents: [
                {
                    parts: [
                        { text: prompt + " You are a QA engineer. Respond strictly in JSON format like this: { \"passed\": boolean, \"findings\": string[] }" },
                        {
                            inlineData: {
                                mimeType: "image/png",
                                data: base64Image
                            }
                        }
                    ]
                }
            ],
            generationConfig: {
                responseMimeType: "application/json"
            }
        };

        // Execute the real API request
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log(`AI Vision Agent analysis completed successfully.`);

        try {
            // Parse the JSON strictly returned by the Gemini model
            const textResponse = data.candidates[0].content.parts[0].text;
            const aiResult = JSON.parse(textResponse);
            return {
                passed: Boolean(aiResult.passed),
                findings: aiResult.findings || []
            };
        } catch (err) {
            return { passed: false, findings: ['Failed to parse JSON response from AI.'] };
        }
    }

    test('Audit Login Page layout and design consistency using AI Vision_sample', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);

        await page.goto(sauceDemoUrl);
        await page.waitForLoadState('networkidle');

        // Capture a full page screenshot using Playwright's standard screenshot capability
        const screenshot = await page.screenshot({ fullPage: true });

        // Invoke the AI Visual Auditing Agent to review the visual aesthetics
        const auditResult = await aiVisualAuditAgent(
            page,
            screenshot,
            "Inspect the layout structure. Verify there are no overlapping containers, broken input borders, or poorly contrasted elements."
        );

        // Print AI visual reviewer findings
        console.log('AI Vision Audit Report Summary:');
        auditResult.findings.forEach(finding => console.log(`  - [INFO] ${finding}`));

        // Assert that the AI Vision agent has flagged no blocker UX/UI bugs
        expect(auditResult.passed).toBe(true);
    });
});
