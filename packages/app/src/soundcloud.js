import puppeteer from 'puppeteer'




export const searchSoundcloud = async () => {
    const BASE_URL = 'https://soundcloud.com/'
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
    await page.waitForSelector('.sc-link-dark span')
    const results =  await page.evaluate(() => {
      const elements = Array.from(document.querySelectorAll('.sc-link-dark span'))
      return elements.map(element => {
        return {
          name: element.textContent
        }
      })
    })
    return results
}

