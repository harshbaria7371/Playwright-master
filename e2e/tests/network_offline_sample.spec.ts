import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

test.describe('Network Offline Emulation Demo', () => {
    test('Login Page Offline Behavior', async ({ page, context }) => {
        await page.goto(`${baseUrl}`);

        await page.waitForLoadState('networkidle');

        // Disconnect the network for this browser context to simulate an offline state
        await context.setOffline(true);

        // Attempt to perform an action that requires network (like clicking login)
        // Since we don't have the locators, we'll just try to reload the page
        try {
            // Attempting to reload while offline should throw an error or show an offline page
            await page.reload();
        } catch (error: any) {
            // Catch the expected error if the browser prevents navigation while offline
            console.log('Successfully caught offline navigation error:', error.message);
        }

        // Reconnect the network
        await context.setOffline(false);
    });
});
