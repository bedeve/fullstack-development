import puppeteer from 'puppeteer';
import {scrape} from '../utils/browser/common_scraper'
import asyncRequest from '../utils/asyncRequest'
import cheerio from 'cheerio'
import {commonStaticScraper} from '../utils/commonStaticScraper';
const MUSICBRAINZ_BASE_URL = 'https://musicbrainz.org';
const musicBrainzSelectors = {
  searchField: "#headerid-query",
  searchListItem: "#content > table > tbody > tr:first-child",
  properties: {
    name: {
      selector: "td:nth-child(1) > a ",
      attribute: "title"
    },
    url: {
      selector: "td:first-child > a",
      attribute: "href"
    }
  }
}
const getMusicBrainzArtistUrl = (query) => `https://musicbrainz.org/search?query=${query}&type=artist`
export const searchMusicBrainz = async (query) => {
  /** create a browser instance, then a page instance with it */
  const scrapeUrl  = getMusicBrainzArtistUrl(query)
  
  const html = await asyncRequest(scrapeUrl)
  // console.log(html)
  const $ = cheerio.load(html)
  return commonStaticScraper($, musicBrainzSelectors,  scrapeUrl);
};


