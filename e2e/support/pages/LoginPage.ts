import { Page } from '@playwright/test';
import LoginPageElements from '../elements/LoginPageElements';
import BasePage from './BasePage';

/**
 * LoginPage is a page object representing the login screen.
 * It composes LoginPageElements to separate locators from page-level actions.
 *
 * Example usage in a test:
 * import LoginPage from '../support/pages/LoginPage';
 * const loginPage = new LoginPage(page);
 * await loginPage.loginPageElements.usernameInput.fill('user');
 * await loginPage.verifyPageTitle('Login');
 */
export default class LoginPage extends BasePage {
    readonly loginPageElements: LoginPageElements;

    constructor(readonly page: Page) {
        super(page);
        this.page = page;
        this.loginPageElements = new LoginPageElements(page);
    }

    async login(customerName: string, username: string, password: string): Promise<void> {
        await this.loginPageElements.customerInput.fill(customerName);
        await this.loginPageElements.usernameInput.fill(username);
        await this.loginPageElements.passwordInput.fill(password);
        await this.loginPageElements.connectionButton.click();
    }

    async completeMFALogin(): Promise<void> {
        // Using a glob pattern allows this to work across different baseUrls (like dev, QA, prod)
        await this.page.waitForURL('**/Security/Login*');
        await this.waitForLoaderToDisappear();
        await this.loginPageElements.mfaTfaCodeInput.fill('000000');
        await this.loginPageElements.mfaValidateButton.click();
    }

    async verifyInvalidLoginMessage(): Promise<void> {
        await this.loginPageElements.errorMessage.waitFor({ state: 'visible' });
    }

    async verifyInvalidCustomerMessage(): Promise<void> {
        await this.loginPageElements.errorCustomerMessage.waitFor({ state: 'visible' });
    }

}