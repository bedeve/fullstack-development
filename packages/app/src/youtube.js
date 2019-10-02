import puppeteer from 'puppeteer';
import { SSL_OP_EPHEMERAL_RSA } from 'constants';
const YOUTUBE_BASE_URL = 'https://www.youtube.com';
const youtubeSelectors = {
  searchField: "#search",
  searchListItem: "#dismissable",
  itemName: "#video-title",
  itemUrl: "#thumbnail",
  itemUser: "a.yt-simple-endpoint.style-scope.yt-formatted-string",
  itemImage: "",
  itemTags: "",
}
export const searchYoutube = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(YOUTUBE_BASE_URL, {timeout: 1000000});
  await page.waitForSelector(youtubeSelectors.searchField, {timeout: 1000000});
  await page.click(youtubeSelectors.searchField);
  await page.type(youtubeSelectors.searchField, "HGEMONAS");
  await page.keyboard.press('Enter');
  await page.waitFor(1000);
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
        name: element.querySelector(itemName).title,
        url: element.querySelector(itemUrl).href,
        user: element.querySelector(itemUser).textContent,
        // img: element.querySelector(itemImage).src,
        // tags: element.querySelector(itemTags).textContent,
      };
    });
  }, youtubeSelectors); // pass here any variables you need to access in the evaluate function
  return results;
};