import puppeteer from 'puppeteer';
const YOUTUBE_BASE_URL = 'https://soundcloud.com/discover';
const youtubeSelectors = {
  searchField: ".headerSearch__input",
  searchListItem: ".sound__body",
  itemName: ".sc-link-dark span",
  itemUrl: ".sc-link-dark",
  itemUser: ".soundTitle__usernameText",
  itemImage: "",
  itemTags: "",
}
export const searchYoutube = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(YOUTUBE_BASE_URL);
  await page.waitForSelector(youtubeSelectors.searchField);
  await page.click(youtubeSelectors.searchField);
  await page.type(youtubeSelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(youtubeSelectors.searchListItem);

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
        // img: element.querySelector(itemImage).src,
        // tags: element.querySelector(itemTags).textContent,
      };
    });
  }, youtubeSelectors); // pass here any variables you need to access in the evaluate function
  return results;
};