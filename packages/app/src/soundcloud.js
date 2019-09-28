import puppeteer from 'puppeteer'




export const searchSoundcloud = async () => {
  const BASE_URL = 'https://soundcloud.com/'
  const usernameField = ".soundTitle__usernameText"
  const searchField = ".headerSearch__input"
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
  const searchListItem = ".sound__body";
  const itemName = ".sc-link-dark span";
  const itemUser;
  const itemImage;
  const itemUrl;
  const itemTags;
  await page.waitForSelector(searchListItem)
  const results = await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll(searchListItem))
    return elements.map(element => {
      // console.log(element)
      return {
        name: element.querySelector(itemName).textContent,
        url: element.querySelector(itemUrl).href,
        img: element.querySelector(itemImage).src
      }
    })
  })
  console.log(results)
  // return results
}

