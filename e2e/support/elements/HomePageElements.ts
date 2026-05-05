import { Locator, Page } from '@playwright/test';
import BaseElements from './BaseElements';

export default class HomePageElements extends BaseElements {
    constructor(readonly page: Page) {
        super(page);
        // BaseElements already stores the page reference on this.page.
        this.page = page;
    }



};