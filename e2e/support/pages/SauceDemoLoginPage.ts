import { Page } from '@playwright/test';
import SauceDemoLoginPageElements from '../elements/SauceDemoLoginPageElements';
import BasePage from './BasePage';

/**
 * SauceDemoLoginPage encapsulates the actions performed on the Sauce Demo login page.
 * It strictly follows the Page Object Model (POM) pattern.
 */
export default class SauceDemoLoginPage extends BasePage {
    readonly loginElements: SauceDemoLoginPageElements;

    constructor(readonly page: Page) {
        super(page);
        this.loginElements = new SauceDemoLoginPageElements(page);
    }

    /**
     * Performs a standard login flow on Sauce Demo.
     * @param username - Username to log in with
     * @param password - Password to log in with
     */
    async login(username: string, password: string): Promise<void> {
        await this.loginElements.usernameInput.fill(username);
        await this.loginElements.passwordInput.fill(password);
        await this.loginElements.loginButton.click();
    }

    /**
     * Verifies that the invalid login error message is displayed on the screen.
     */
    async verifyInvalidLoginMessage(): Promise<void> {
        await this.loginElements.errorMessage.waitFor({ state: 'visible' });
    }
}
