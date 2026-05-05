import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

/**
 * LoginPageElements groups the login page locators and exposes them to page objects.
 * It extends BaseElements so it can reuse the shared `page` instance.
 *
 * Example usage:
 * import LoginPageElements from './LoginPageElements';
 * const loginPageElements = new LoginPageElements(page);
 * await loginPageElements.usernameInput.fill('myuser');
 */
export default class LoginPageElements extends BaseElements {
    constructor(readonly page: Page) {
        super(page);
        // BaseElements already stores the page reference on this.page.
        this.page = page;
    }

    get customerInput(): Locator {
        return this.page.locator('#Command_Account');
    }

    get usernameInput(): Locator {
        return this.page.locator('#Command_Login');
    }

    get passwordInput(): Locator {
        return this.page.locator('#Command_Password');
    }

    get connectionButton(): Locator {
        return this.page.getByRole('button', { name: 'Connection' });
    }

    get mfaTfaCodeInput(): Locator {
        return this.page.locator('#Command_MfaKey');
    }

    get mfaValidateButton(): Locator {
        return this.page.locator('#verifyButton');
    }

    get errorMessage(): Locator {
        return this.page.getByText('Login or password is not valid');
    }

    get errorCustomerMessage(): Locator {
        return this.page.getByText('Customer does not exist');
    }
}