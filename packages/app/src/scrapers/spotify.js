import puppeteer from 'puppeteer';
import {scrape} from '../utils/browser/common_scraper'
const SPOTIFY_BASE_URL = 'https://open.spotify.com/';


const spotifySelectors = {
  search: "#main > div > div.Root__top-container > div.Root__nav-bar > nav > ul > li:nth-child(2) > div > a",
  searchField: "#main > div > div.Root__top-container > div.Root__main-view.Root__main-view--has-top-bar > div.main-view-container > div > div > section > div.Search__header > div > div > input",
  selectCat:"#main > div > div.Root__top-container > div.Root__main-view.Root__main-view--has-top-bar > div.main-view-container > div > div > section > div.Search__content > div > nav > ul > li:nth-child(2) > div > a",
  searchListItem:"#main > div > div.Root__top-container > div.Root__main-view.Root__main-view--has-top-bar > div.main-view-container > div > div > section > div.Search__content > div > div > section > div > div > div:nth-child(1) > div > div > div > div",
  properties: {
    name: {
      selector:"#main > div > div.Root__top-container > div.Root__main-view.Root__main-view--has-top-bar > div.main-view-container > div > div > section > div.Search__content > div > div > section > div > div > div:nth-child(1) > div > div > div > div > div.mo-info > div > a",
      attribute: "title"
    },
    url: {
      selector:"#main > div > div.Root__top-container > div.Root__main-view.Root__main-view--has-top-bar > div.main-view-container > div > div > section > div.Search__content > div > div > section > div > div > div:nth-child(1) > div > div > div > div > div.mo-info > div > a",
      attribute: "href"
    }
  }
}
export const searchSpotify = async (query) => {
  /** create a browser instance, then a page instance with it */

  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(SPOTIFY_BASE_URL, {timeout: 100000});
  await page.waitForSelector(spotifySelectors.search);
  await page.click(spotifySelectors.search);
  await page.click(spotifySelectors.searchField);
  await page.type(spotifySelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitForSelector(spotifySelectors.selectCat);
  await page.click(spotifySelectors.selectCat);
  await page.waitForSelector(spotifySelectors.searchListItem);

  // to be able to pass variables in the function that will run in the browser
  // we have to add the data after the function and also in the function
  // arguments
  const results = await page.evaluate(scrape, spotifySelectors); // pass here any variables you need to access in the evaluate function
  await browser.close()
  return results;
};

