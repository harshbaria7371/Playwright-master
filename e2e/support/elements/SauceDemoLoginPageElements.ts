import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

/**
 * SauceDemoLoginPageElements groups the locators for the Sauce Demo login screen.
 * It extends BaseElements to reuse the Page object reference.
 */
export default class SauceDemoLoginPageElements extends BaseElements {
    constructor(readonly page: Page) {
        super(page);
    }

    /**
     * Getter for the username input field.
     */
    get usernameInput(): Locator {
        return this.page.locator('[data-test="username"]');
    }

    /**
     * Getter for the password input field.
     */
    get passwordInput(): Locator {
        return this.page.locator('[data-test="password"]');
    }

    /**
     * Getter for the login submit button.
     */
    get loginButton(): Locator {
        return this.page.locator('[data-test="login-button"]');
    }

    /**
     * Getter for any error message container shown during failed login.
     */
    get errorMessage(): Locator {
        return this.page.locator('[data-test="error"]');
    }
}
