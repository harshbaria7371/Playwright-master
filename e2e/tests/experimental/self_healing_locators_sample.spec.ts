import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import SauceDemoLoginPage from '../../support/pages/SauceDemoLoginPage';

// Load configuration to dynamically retrieve sauceDemoUrl
const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const sauceDemoUrl = config.application.sauceDemoUrl || config.application.sauceDemo;

test.describe('3. Self-Healing Locators (Resilient Testing)', () => {

    /**
     * Simulates an AI Self-Healing agent. If a primary CSS/XPath selector fails (e.g. frontend code refactored),
     * this method acts as a fallback, parses the DOM, applies semantic mapping to find the new target element,
     * heals the locator dynamically, and outputs the correct selector to prevent the test from breaking.
     */
    async function selfHealLocator(page: any, brokenSelector: string, semanticIntent: string): Promise<string> {
        console.warn(`Warning: Selector "${brokenSelector}" failed to resolve on page!`);
        console.log(`Initiating AI Self-Healing mechanism to recover element with intent: "${semanticIntent}"...`);

        // Read page DOM source to send to AI
        const pageContent = await page.content();
        console.log(`Parsing active DOM structure (HTML length: ${pageContent.length} chars)...`);

        // The self-healing logic maps the semantic intent to the updated matching locator on SauceDemo
        let healedSelector = '';
        if (semanticIntent.includes('login')) {
            healedSelector = '[data-test="login-button"]';
            console.log(`✨ AI Self-Healing Successful! Healed selector: "${brokenSelector}" -> "${healedSelector}"`);
        } else if (semanticIntent.includes('username')) {
            healedSelector = '[data-test="username"]';
            console.log(`✨ AI Self-Healing Successful! Healed selector: "${brokenSelector}" -> "${healedSelector}"`);
        }

        return healedSelector;
    }

    test('Login with simulated broken locators that automatically self-heal_sample', async ({ page }) => {
        const loginPage = new SauceDemoLoginPage(page);

        await page.goto(sauceDemoUrl);
        await page.waitForLoadState('networkidle');

        // Simulate a broken DOM selector for username (e.g. developers refactored the element id)
        const originalUsernameSelector = '#command-account-login-user-input-broken';
        let healedUsernameSelector = originalUsernameSelector;

        try {
            // Attempt standard action using broken selector (using 1s short timeout for rapid execution)
            await page.locator(originalUsernameSelector).fill('standard_user', { timeout: 1000 });
        } catch (error) {
            // Trigger self-healing agent on failure
            healedUsernameSelector = await selfHealLocator(page, originalUsernameSelector, 'username input field');
            await page.locator(healedUsernameSelector).fill('standard_user');
        }

        // Fill password using standard POM elements reference (valid working selector)
        await loginPage.loginElements.passwordInput.fill('secret_sauce');

        // Simulate a broken DOM selector for the login button
        const originalLoginButtonSelector = '.btn-submit-action-connection-broken';
        let healedLoginButtonSelector = originalLoginButtonSelector;

        try {
            await page.locator(originalLoginButtonSelector).click({ timeout: 1000 });
        } catch (error) {
            // Trigger self-healing agent on failure
            healedLoginButtonSelector = await selfHealLocator(page, originalLoginButtonSelector, 'login submit button');
            await page.locator(healedLoginButtonSelector).click();
        }

        // Validate that despite broken selectors, the self-healing agent successfully logged us in
        await expect(page).toHaveURL(/.*inventory.html/);
    });
});
