import puppeteer from 'puppeteer';
const MIXCLOUD_BASE_URL = 'https://www.mixcloud.com/';
const mixcloudSelectors = {
  searchField: ".search",
  searchListItem: ".card.card-small",
  itemName: "div>h1",
  itemUrl: "div>h1>a",
  itemUser: ".hovercard-anchor",
  itemImage: ".album-art",
  itemTags: ".tag-dropdown-wrap",
}
export const searchMixcloud = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(MIXCLOUD_BASE_URL);
  await page.waitForSelector(mixcloudSelectors.searchField);
  await page.click(mixcloudSelectors.searchField);
  await page.type(mixcloudSelectors.searchField, 'lana del rey');
  await page.waitForSelector(mixcloudSelectors.searchListItem);

  // to be able to pass variables in the function that will run in the browser
  // we have to add the data after the function and also in the function
  // arguments
  const results = await page.evaluate(({
    searchListItem, 
    itemName, 
    itemUrl, 
    itemUser, 
    itemImage, 
    itemTags
  }) => {
    const elements = Array.from(document.querySelectorAll(searchListItem));
    return elements.map(element => {
      return {
        name: element.querySelector(itemName).textContent,
        url: element.querySelector(itemUrl).href,
        user: element.querySelector(itemUser).textContent,
        //img: element.querySelector(itemImage).src,
        //tags: element.querySelector(itemTags).textContent,
      };
    });
  }, mixcloudSelectors); // pass here any variables you need to access in the evaluate function
  return results;
};