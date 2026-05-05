import { Page } from '@playwright/test'

/**
 * BaseElements is an abstract helper class that stores the Playwright Page object.
 *
 * Extend this class in page object or element helper classes to share the
 * `page` reference and keep element actions consistent across the test suite.
 *
 * Example usage in another file:
 *
 * import BaseElements from './support/elements/BaseElements';
 *
 * class LoginPage extends BaseElements {
 *   constructor(page: Page) {
 *     super(page);
 *   }
 *
 *   async login(username: string, password: string) {
 *     await this.page.fill('#user', username);
 *     await this.page.fill('#pass', password);
 *     await this.page.click('button[type="submit"]');
 *   }
 * }
 */
export default abstract class BaseElements {
    constructor(readonly page: Page) {
        this.page = page;
    }
}