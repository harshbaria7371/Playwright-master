import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';
import * as dotenv from 'dotenv';
import LoginPage from '../support/pages/LoginPage';
import loginData from '../support/fixtures/loginData.json';
import HomePage from '../support/pages/HomePage';

// Load environment variables from .env file
dotenv.config();

const configPath = join(process.cwd(), 'e2e/support/fixtures/config.yml');
const config = yaml.load(readFileSync(configPath, 'utf8')) as any;
const baseUrl = config.application.base_url;

test.describe('Login Page', () => {
    test('successful login', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(`${baseUrl}`);
        await loginPage.login(loginData.customerName, loginData.username, loginData.password);

        await loginPage.completeMFALogin();

        const homePage = new HomePage(page);
        await homePage.verifyDashboardUrl();
    });

    test('failed login - wrong password', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(`${baseUrl}`);
        await loginPage.login(loginData.customerName, loginData.username, 'wrongpassword');
        await loginPage.verifyInvalidLoginMessage();
    });

    test('failed login - wrong customer name', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(`${baseUrl}`);
        await loginPage.login('wrongcustomer', loginData.username, loginData.password);
        await loginPage.verifyInvalidCustomerMessage();
    });

    test('failed login - wrong username', async ({ page }) => {
        const loginPage = new LoginPage(page);

        await page.goto(`${baseUrl}`);
        await loginPage.login(loginData.customerName, 'wrongusername', loginData.password);
        await loginPage.verifyInvalidLoginMessage();
    });
});