import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/homepage';
import { ResultPage } from '../pages/resultpage';
import { searchScreen } from '../pages/searchscreen';
import { qaTestData } from "../test-data/qa/google.json";
import { stageTestData } from "../test-data/stage/google.json";
import { link } from 'fs';
import { highlightElement } from '../utils/utilities';

type prodData = {
    name: string,
    price: string,
}

let amazonTestData: prodData = {
    name: '',
    price: '',
};

let flipkartTestData = {
    name: '',
    price: '',
    link: ''
}

test.describe(() => {
    test('UI automation tests for AMAZON', async ({ page }) => {

        const homepage = new HomePage(page);
        const resultpage = new ResultPage(page);
        const searchpage = new searchScreen(page);

        await test.step('Go to URL', async () => {
            await homepage.goto();
        });

        await test.step('Search with keywords', async () => {
            await homepage.searchKeywords("Pixel 8a");
        });

        await test.step("get Product details", async () => {
            // @ts-ignore
            amazonTestData = await searchpage.GetProuctDetails();
        });

        await test.step("buy item", async () => {
            const prodLink = await resultpage.buyItem();
            Object.assign(amazonTestData, { link: prodLink });
            console.log("-------------------------data--------------------")
            console.log(JSON.stringify(amazonTestData));
        });

        page.close();
    })

    test('UI automation test for FLIPKART', async ({ page }) => {
        await test.step('Go to URL', async () => {
            await page.goto("https://www.flipkart.com/");
        });

        await test.step('Search with keywords', async () => {
            await highlightElement(page.locator('[class="Pke_EE"]'));
            await page.locator('[class="Pke_EE"]').click();
            await page.locator('[class="Pke_EE"]').fill("Pixel 8a");
            await page.locator('[class="Pke_EE"]').press('Enter');
        });

        await test.step("get Product details", async () => {
            await highlightElement(page.locator(`(//div[contains(@class,'row')]//div//div)[1]`));
            const prodName = await page.locator(`(//div[contains(@class,'row')]//div//div)[1]`).innerText();
            await highlightElement(page.locator(`//div[contains(@class,'row')]//div[contains(text(),"₹")]`).first());
            const prodPrice = await page.locator(`//div[contains(@class,'row')]//div[contains(text(),"₹")]`).first().innerText();
            await highlightElement(page.locator(`(//a[contains(@href,"/google-pixel-8a")])[1]`).first());
            const prodLink = await page.locator(`(//a[contains(@href,"/google-pixel-8a")])[1]`).getAttribute("href");

            flipkartTestData = {
                ...flipkartTestData,
                'name': prodName,
                'price': prodPrice,
                //@ts-ignore
                'link': prodLink
            };
        });

        await test.step("buy item", async () => {

            const [newTab] = await Promise.all([
                page.waitForEvent("popup"),
                page.locator(`(//div[contains(@class,'row')]//div//div)[1]`).click()
            ]);

            await highlightElement(newTab.locator(`//button[normalize-space()='Buy Now']`));
            newTab.locator(`//button[normalize-space()='Buy Now']`).click();

            console.log("-------------------------data--------------------")
            console.log(JSON.stringify(flipkartTestData));
        });

        page.close();
    })

    test('Compare prices between Amazon and Flipkart', async ({ page }) => {


        function parsePrice(priceString: string) {
            return parseFloat(priceString.replace(/[^0-9.]/g, ''));
        }

        // Extract prices
        const amazonPrice = parsePrice(amazonTestData.price);
        const flipkartPrice = parsePrice(flipkartTestData.price);

        // Compare prices
        const lowerPricePlatform = amazonPrice < flipkartPrice ? 'Amazon' : 'Flipkart';
        const lowerPrice = amazonPrice < flipkartPrice ? amazonPrice : flipkartPrice;

        console.log(`Amazon Price: ${amazonPrice}`);
        console.log(`Flipkart Price: ${flipkartPrice}`);
        console.log(`The lowest price is on ${lowerPricePlatform}: ₹${lowerPrice}`);
    });
});