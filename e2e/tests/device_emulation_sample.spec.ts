import { test, expect, devices } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

// Override the default use settings for this specific file to emulate an iPhone 13 Pro
test.use({
    ...devices['iPhone 13 Pro'],
});

test.describe('Device Emulation Demo', () => {

    test('Login Page Mobile Emulation', async ({ page }) => {
        await page.goto(`${baseUrl}`);

        // You can add assertions here to verify that the mobile layout is correct.
        // For example, checking if a specific mobile menu or responsive element is visible.

        // Wait for the page to finish loading completely before taking a screenshot
        await page.waitForLoadState('networkidle');

        // Take a screenshot of the entire page and compare it to a baseline image.
        // The first time this runs, it will fail and create a baseline image.
        // Subsequent runs will compare against the baseline.
        await expect(page).toHaveScreenshot('login-page.png', {
            // Allow a small percentage of pixel difference to avoid flaky tests
            maxDiffPixelRatio: 0.05
        });

        // Wait for a short time to observe the layout (useful for demo purposes)
        await page.waitForTimeout(2000);
    });
});
