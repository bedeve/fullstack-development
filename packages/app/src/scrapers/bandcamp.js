import puppeteer from 'puppeteer';
import {scrape} from '../utils/browser/common_scraper'
const BANDCAMP_BASE_URL = 'https://bandcamp.com/';


const bandCampSelectors = {
  searchField: ".you-autocomplete-me.dismiss-tooltip-alt",
  searchListItem: ".result-info",
  properties: {
    name: {
      selector: ".result-info>div.heading>a",
      attribute: "textContent"
    },
    url: {
      selector: ".result-info>div.heading>a",
      attribute: "href"
    }
  }
}
export const searchBandCamp = async (query) => {
  /** create a browser instance, then a page instance with it */

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(BANDCAMP_BASE_URL, {timeout: 100000});
  await page.waitForSelector(bandCampSelectors.searchField);
  await page.click(bandCampSelectors.searchField);
  await page.type(bandCampSelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(bandCampSelectors.searchListItem);

  // to be able to pass variables in the function that will run in the browser
  // we have to add the data after the function and also in the function
  // arguments
  const results = await page.evaluate(scrape, bandCampSelectors); // pass here any variables you need to access in the evaluate function
  await browser.close()
  return results;
};

