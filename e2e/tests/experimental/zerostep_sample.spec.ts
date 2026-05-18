import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import SauceDemoLoginPage from '../../support/pages/SauceDemoLoginPage';

// Load configuration to dynamically retrieve sauceDemoUrl
const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const sauceDemoUrl = config.application.sauceDemoUrl || config.application.sauceDemo;

test.describe('1. Natural Language / ZeroStep AI Testing', () => {

    /**
     * Simulates an AI Interpreter function that executes plain English commands.
     * In a production environment, you would run `npm install @zerostep/playwright`
     * and use their `ai()` assistant import:
     * 
     * import { ai } from '@zerostep/playwright';
     * await ai('Fill the username input with standard_user', { page, test });
     */
    async function aiAgentAction(page: any, instruction: string) {
        console.log(`AI Agent interpreting instruction: "${instruction}"`);

        // Simulating the AI analyzing the page DOM dynamically and choosing appropriate actions
        if (instruction.includes('username') || instruction.includes('user-name')) {
            console.log(`AI identified: Username input field (Locator: [data-test="username"])`);
            await page.locator('[data-test="username"]').fill('standard_user');
        } else if (instruction.includes('password')) {
            console.log(`AI identified: Password input field (Locator: [data-test="password"])`);
            await page.locator('[data-test="password"]').fill('secret_sauce');
        } else if (instruction.includes('click') && instruction.includes('login')) {
            console.log(`AI identified: Login button (Locator: [data-test="login-button"])`);
            await page.locator('[data-test="login-button"]').click();
        } else if (instruction.includes('verify') || instruction.includes('assert')) {
            console.log(`AI validating page redirection status...`);
            await expect(page).toHaveURL(/.*inventory.html/);
        }
    }

    test('Perform login using plain English AI steps_sample', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);

        await page.goto(sauceDemoUrl);

        await page.waitForLoadState('networkidle');

        // Instead of hardcoding Page Element calls directly in the test body,
        // we pass natural language instructions to show how @zerostep/playwright functions:
        await aiAgentAction(page, 'Enter "standard_user" into the username input');
        await aiAgentAction(page, 'Enter "secret_sauce" into the password input');
        await aiAgentAction(page, 'Click the login button to proceed');
        await aiAgentAction(page, 'Verify the user is logged in and redirected to the inventory landing page');
    });
});
