import puppeteer from 'puppeteer';
import {scrape} from '../utils/browser/common_scraper'
const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org';
const musicBrainzSelectors = {
  searchField: "#headerid-query",
  searchListItem: "#content > table > tbody > tr:first-child",
  itemName: "#content > table > tbody > tr:first-child > td:first-child > a > bdi"    ,
  itemUrl: "#content > table > tbody > tr:first-child > td:first-child > a"
}
export const searchMusicBrainz = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(MUSICBRAINZ_BASE_URL, {timeout: 100000});
  await page.waitForSelector(musicBrainzSelectors.searchField);
  await page.click(musicBrainzSelectors.searchField);
  await page.type(musicBrainzSelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(musicBrainzSelectors.searchListItem);

  // to be able to pass variables in the function that will run in the browser
  // we have to add the data after the function and also in the function
  // arguments
  const results = await page.evaluate(scrape , musicBrainzSelectors ); // pass here any variables you need to access in the evaluate function
  await browser.close()
  return results;
};

