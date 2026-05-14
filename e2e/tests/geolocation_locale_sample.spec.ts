import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

test.describe('Geolocation, Locale, and Timezone Demo', () => {
    // Override the default use settings to emulate a user in France
    test.use({
        // Set the locale to French (France)
        locale: 'fr-FR',
        // Set the timezone to Central European Time (Paris)
        timezoneId: 'Europe/Paris',
        // Set specific geographic coordinates (e.g., Paris, France)
        geolocation: { longitude: 2.3522, latitude: 48.8566 },
        // Grant permissions to the browser to access geolocation without prompting
        permissions: ['geolocation'],
    });

    // Define a test case to verify the French localization on the Login Page
    test('Login Page in French Locale', async ({ page }) => {
        await page.goto(`${baseUrl}`);

        // Here you would typically assert that the text is displayed in French.
        // For example: await expect(page.locator('h1')).toHaveText('Connexion');

        // Wait for a short time to observe the locale changes (useful for demo purposes)
        await page.waitForTimeout(2000);
    });
});
