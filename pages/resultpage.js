// Inlcude playwright module
const { expect } = require('@playwright/test');
const { highlightElement } = require('../utils/utilities');

// create class
exports.ResultPage = class ResultPage {

    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page) {
        // Init page object
        this.page = page;

        this.buyNow = page.locator(`[id="buy-now-button"]`);
    }

    async buyItem() {

        console.log("old url ===> " + this.page.url());

        const [newTab] = await Promise.all([
            this.page.waitForEvent("popup"),
            this.page.locator('[class="a-price-whole"]').first().click()
        ]);

        this.page = newTab;

        const newUrl = newTab.url();

        this.page.bringToFront();

        await newTab.locator('[id="buy-now-button"]').click();

        return newUrl;
    }
}