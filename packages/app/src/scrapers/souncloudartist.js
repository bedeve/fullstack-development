import puppeteer from 'puppeteer';
const SOUNDCLOUD_BASE_URL = 'https://soundcloud.com/discover';
const soundCloudSelectors = {
  searchField: ".headerSearch__input",
  searchListItem: ".userItem.sc-media.m-horizontal",
  itemName: ".userItem.sc-media.m-horizontal>div>h2",
}
export const searchSoundcloud = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(SOUNDCLOUD_BASE_URL, {timeout: 100000});
  await page.waitForSelector(soundCloudSelectors.searchField);
  await page.click(soundCloudSelectors.searchField);
  await page.type(soundCloudSelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(soundCloudSelectors.searchListItem);

  // to be able to pass variables in the function that will run in the browser
  // we have to add the data after the function and also in the function
  // arguments
  const results = await page.evaluate(({
    searchListItem, 
    itemName, 
  }) => {
    const elements = Array.from(document.querySelectorAll(searchListItem));
    return elements.map(element => {
      return {
        name: element.querySelector(itemName).textContent,
        // img: element.querySelector(itemImage).src,
        // tags: element.querySelector(itemTags).textContent,
      };
    });
  }, soundCloudSelectors); // pass here any variables you need to access in the evaluate function
  await browser.close()
  return results;
};