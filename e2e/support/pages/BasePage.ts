import { Page, expect } from '@playwright/test';

/**
 * BasePage is an abstract page object base class for shared page actions.
 * Extend this class when creating page objects to reuse common assertions.
 *
 * Example usage:
 * import BasePage from './BasePage';
 * class LoginPage extends BasePage {
 *   constructor(page: Page) {
 *     super(page);
 *   }
 * }
 */
export default abstract class BasePage {
    constructor(readonly page: Page) {
        this.page = page;
    }

    async verifyPageTitle(title: string): Promise<void> {
        await expect(this.page).toHaveTitle(title);
    }

    async verifyPageURL(url: string): Promise<void> {
        await expect(this.page).toHaveURL(url);
    }

    async waitForLoaderToDisappear(): Promise<void> {
        await this.page.waitForSelector('.wcloudDivLoader', { state: 'hidden' });
    }

}