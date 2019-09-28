import puppeteer from 'puppeteer'

export const getCommits = async (user, repo) => {
  const BASE_URL = 'https://github.com/'
  const URL_FRAGMENT = '#/IP/'

  /** create a browser instance, then a page instance with it */
  const browser = await puppeteer.launch(
    { headless: false }
  )
  const page = await browser.newPage()

  /**
   * bet365 forces a landing page on you, so we navigate to
   * the base url, then go onto the fixtures page
   */
  await page.goto(`${BASE_URL}${user}/${repo}/commits/`)

  /** navigate to the schedule section */
  await page.waitForSelector('.commits-listing')
  console.log("commits appear")
    // .then(async () =>
    //   (await page.$x("//div[contains(@class, 'ip-ControlBar_BBarItem') and text() = 'Schedule']"))[0]
    //     .click())

  /** navigate to the soccer section within the schedule */
  // await page.waitForSelector('.ips-InPlayNavBarButton')
  //   .then(async () =>
  //     (await page.$x("//div[contains(@class, 'ips-InPlayNavBarButton') and text() = 'Soccer']"))[0]
  //       .click())

  /**
   * find all fixture divs, loop through them and extract
   * the appropriate data (time, home team, away team)
   * into it's own object and return it
   */
  return await page.evaluate(() => {
    const elements = Array.from(document.querySelectorAll('.table-list-cell'))
    
    return elements.map(element => {
      
      return {
        name: element.querySelector(".commit-title").textContent,
        author: element.querySelector(".user-mention").textContent,
        time: element.querySelector("relative-time").datetime,
      }
    })
  })
}
