import { Locator } from "@playwright/test";

export async function highlightElement(element: Locator) {
    try {
        await element.evaluate((el) => {
            el.style.background = 'yellow';
            el.style.border = '2px solid red';
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        await element.evaluate((el) => {
            el.style.border = '3px solid red';
            el.removeAttribute("style");
        });
    } catch (error) {
        console.log("couldnt highlight the element");
    }
}