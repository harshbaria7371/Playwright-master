import { Page } from '@playwright/test';
import HomePageElements from '../elements/HomePageElements';
import BasePage from './BasePage';

export default class HomePage extends BasePage {
    readonly homePageElements: HomePageElements;

    constructor(readonly page: Page) {
        super(page);
        this.page = page;
        this.homePageElements = new HomePageElements(page);
    }

    async verifyDashboardUrl(): Promise<boolean> {
        await this.page.waitForURL('**/dashboard**');
        return true;
    }

}