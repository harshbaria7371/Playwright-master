import { Page } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import loginData from '../fixtures/loginData.json';

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

/**
 * Common function to perform login.
 * This can be called in the `beforeEach` hook of your test files.
 */
export async function performLogin(page: Page): Promise<void> {
    const loginPage = new LoginPage(page);

    // Navigate and login
    await page.goto(`${baseUrl}`);
    await loginPage.login(loginData.customerName, loginData.username, loginData.password);

    // Complete MFA step
    await loginPage.completeMFALogin();

    // Verify successful login by checking dashboard URL
    const homePage = new HomePage(page);
    await homePage.verifyDashboardUrl();
}
