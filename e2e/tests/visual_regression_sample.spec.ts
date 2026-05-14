import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

test.describe('Visual Regression Testing Demo', () => {
    test('Login Page Visual Comparison', async ({ page }) => {
        await page.goto(`${baseUrl}`);

        // Wait for the page to finish loading completely before taking a screenshot
        await page.waitForLoadState('networkidle');

        // Take a screenshot of the entire page and compare it to a baseline image.
        // The first time this runs, it will fail and create a baseline image.
        // Subsequent runs will compare against the baseline.
        await expect(page).toHaveScreenshot('login-page.png', {
            // Allow a small percentage of pixel difference to avoid flaky tests
            maxDiffPixelRatio: 0.05
        });
    });
});
