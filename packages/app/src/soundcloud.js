
import puppeteer from 'puppeteer'




export const searchSoundcloud = async () => {
    const BASE_URL = 'https://soundcloud.com/'
    const searchField = ".headerSearch__input"
    const usernameField = ".soundTitle__usernameText"
    const url = ".soundTitle__title"

    /** create a browser instance, then a page instance with it */
    const browser = await puppeteer.launch(
        {headless: false}
    )
    const page = await browser.newPage()

    await page.goto(`${BASE_URL}`)

    await page.waitForSelector(searchField)
    await page.click(searchField)
    await page.type(searchField, "Bob Marley")
    await page.keyboard.press('Enter');
    await page.waitForSelector('.soundTitle__title')
    const results =  await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.soundTitle__title'))
      return elements.map(element => {
        return {
          name: element.href
  
        }
      })
    })
    return results

import puppeteer from 'puppeteer';
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
    headless: false
  });

  const page = await browser.newPage();
  await page.goto(SOUNDCLOUD_BASE_URL);
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
  }, soundCloudSelectors); // pass here any variables you need to access in the evaluate function
  return results;
};

}
