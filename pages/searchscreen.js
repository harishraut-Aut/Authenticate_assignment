// Inlcude playwright module
import { expect } from '@playwright/test';
import { highlightElement } from '../utils/utilities';

// create class
export class searchScreen {
    /**
     * 
     * @param {import ('@playwright/test').Page} page 
     */
    constructor(page) {
        // Init page object
        this.page = page;

        // Elements
        this.getFirstProduct = (productName) => {
            return page.locator(`(//a//span[contains(text(),"${productName}")])[1]`);
        }

        this.priceOfProduct = page.locator('[class="a-price-whole"]').first();
    }

    async GetProuctDetails() {
        highlightElement(this.getFirstProduct("Pixel 8a"));
        const nameOfProd = await this.getFirstProduct("Pixel 8a").textContent();
        highlightElement(this.priceOfProduct);
        const productPrice = await this.priceOfProduct.textContent();

        return {
            name: nameOfProd,
            price: productPrice,
        }
    };
}