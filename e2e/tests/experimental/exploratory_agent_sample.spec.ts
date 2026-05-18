import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import SauceDemoLoginPage from '../../support/pages/SauceDemoLoginPage';

// Load configuration to dynamically retrieve sauceDemoUrl
const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const sauceDemoUrl = config.application.sauceDemoUrl || config.application.sauceDemo;

test.describe('4. Autonomous Exploratory Testing Agent', () => {

    interface PageState {
        url: string;
        buttons: string[];
        inputs: string[];
    }

    /**
     * Simulates the decision core of an Autonomous AI QA Agent.
     * Takes current parsed page state, compares it to the high-level goal,
     * and decides what step to execute next (filling forms, clicking buttons, asserting, or stopping).
     */
    async function getNextActionFromAIAgent(state: PageState, goal: string): Promise<{ action: 'fill' | 'click' | 'assert' | 'stop', target: string, value?: string }> {
        console.log(`🤖 AI Agent Analyzing Page State...`);
        console.log(`   - Current URL: ${state.url}`);
        console.log(`   - Discovered Inputs: [${state.inputs.join(', ')}]`);
        console.log(`   - Discovered Buttons: [${state.buttons.join(', ')}]`);
        console.log(`🎯 Global Goal: "${goal}"`);

        // AI Agent logic process
        if (state.url.includes('saucedemo.com') && !state.url.includes('inventory.html')) {
            if (state.inputs.includes('username') && state.inputs.includes('password')) {
                console.log('🧠 AI Strategy: Login form discovered. Fill credentials.');
                return { action: 'fill', target: 'credentials' };
            }
        } else if (state.url.includes('inventory.html')) {
            console.log('🧠 AI Strategy: Catalog page detected. Assert success.');
            return { action: 'assert', target: 'login-success' };
        }

        return { action: 'stop', target: 'finished' };
    }

    test('Explore SauceDemo login page autonomously and achieve login success_sample', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);

        await page.goto(sauceDemoUrl);
        await page.waitForLoadState('networkidle');

        // Setting a global goal for the autonomous agent
        const goal = "Autonomously explore the landing page, identify credentials fields, log in, and verify access to catalog inventory.";
        let completed = false;
        let stepsLimit = 5; // Safeguard limit to prevent run-away infinite loops in autonomous flows

        while (!completed && stepsLimit > 0) {
            stepsLimit--;

            // Extract the active page state dynamically using Playwright context evaluation
            const currentUrl = page.url();
            
            const inputs = await page.evaluate(() => 
                Array.from(document.querySelectorAll('input')).map(el => el.getAttribute('data-test') || el.id || el.name || '')
            );
            const buttons = await page.evaluate(() => 
                Array.from(document.querySelectorAll('input[type="submit"], button')).map(el => el.getAttribute('data-test') || el.id || el.className || '')
            );

            const state: PageState = {
                url: currentUrl,
                inputs: inputs.filter(Boolean),
                buttons: buttons.filter(Boolean)
            };

            // Query the AI Agent engine for the next logical step
            const nextAction = await getNextActionFromAIAgent(state, goal);

            if (nextAction.action === 'fill' && nextAction.target === 'credentials') {
                console.log('🚀 AI Decision: Enter credentials and submit login form.');
                
                // Act on the AI Agent's recommendation using POM elements
                await loginPage.loginElements.usernameInput.fill('standard_user');
                await loginPage.loginElements.passwordInput.fill('secret_sauce');
                await loginPage.loginElements.loginButton.click();
                
                await page.waitForLoadState('networkidle');
            } else if (nextAction.action === 'assert' && nextAction.target === 'login-success') {
                console.log('🚀 AI Decision: Inventory page successfully loaded. Verify success.');
                await expect(page).toHaveURL(/.*inventory.html/);
                completed = true;
            } else {
                console.log('🚀 AI Decision: Agent completed flow or hit termination state.');
                completed = true;
            }
        }

        expect(completed).toBe(true);
    });
});
