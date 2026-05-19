import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

// Load configuration
const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const sauceDemoUrl = config.application.sauceDemoUrl || config.application.sauceDemo;

test.describe('Automated Failure Triaging and RCA', () => {

    test('Simulated checkout failure with AI Triage Engine', async ({ page }) => {
        // We use test.fail() so the CI pipeline doesn't actually fail when this sample demonstrates a failure.
        test.fail(true, 'This test is intentionally failing to demonstrate the AI Triage Engine');

        await page.goto(sauceDemoUrl);
        await page.locator('[data-test="username"]').fill('standard_user');
        await page.locator('[data-test="password"]').fill('secret_sauce');
        await page.locator('[data-test="login-button"]').click();
        
        // Add items to cart and go to checkout
        await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
        await page.locator('.shopping_cart_link').click();
        await page.locator('[data-test="checkout"]').click();
        
        // Fill checkout info
        await page.locator('[data-test="firstName"]').fill('John');
        await page.locator('[data-test="lastName"]').fill('Doe');
        await page.locator('[data-test="postalCode"]').fill('12345');
        await page.locator('[data-test="continue"]').click();
        
        // Click finish to submit payment
        await page.locator('[data-test="finish"]').click();
        
        // Simulate waiting for a success message that never appears due to backend NPE
        // Using a short timeout for the demo so it fails quickly
        await expect(page.locator('.complete-header')).toHaveText('Payment Successful - Order #12345', { timeout: 1500 });
    });

});
