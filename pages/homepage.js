// Inlcude playwright module
import { expect } from '@playwright/test';
import { highlightElement } from "../utils/utilities"
// create class
export class HomePage {

    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page) {
        // Init page object
        this.page = page;

        // Elements
        this.searchTextbox = page.locator('[id="twotabsearchtextbox"]');
        this.searchButton = page.locator('[id="nav-search-submit-button"]');
    }

    async goto() {
        await this.page.setViewportSize({ width: 1366, height: 728 });
        await this.page.goto(process.env.URL);
    }

    async searchKeywords(param1) {
        // await expect(this.searchTextbox).toBeEnabled();
        await highlightElement(this.searchTextbox);
        await this.searchTextbox.click();
        await this.searchTextbox.fill(param1);
        await highlightElement(this.searchButton);
        await this.searchButton.click();
        // await this.searchTextbox.press('Enter');
    }

}