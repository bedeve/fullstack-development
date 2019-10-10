import puppeteer from 'puppeteer';
import {scrape} from '../utils/browser/common_scraper'
const SOUNDCLOUD_BASE_URL = 'https://soundcloud.com/discover';
const soundCloudSelectors = {
  searchField: ".headerSearch__input",
  searchListItem: ".sound__body",
  itemName: ".sc-link-dark span",
  itemUrl: ".sc-link-dark",
  itemUser: ".soundTitle__usernameText",
  itemImage: "",
  itemTags: "",
}
export const searchSoundcloud = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: true
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
  const results = await page.evaluate(scrape , soundCloudSelectors); // pass here any variables you need to access in the evaluate function
  await browser.close()
  return results;
};