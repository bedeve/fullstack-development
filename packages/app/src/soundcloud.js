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
}

