export async function highlightElement(element) {

    await element.evaluate((el) => {
        el.style.background = 'yellow';
        el.style.border = '2px solid red';
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await element.evaluate((el) => {
        el.style.border = '3px solid red';
        el.removeAttribute("style");
    });
    
}