import puppeteer from 'puppeteer';

const YOUTUBE_BASE_URL = 'https://www.youtube.com';
const youtubeSelectors = {
  searchField: "#search",
  searchListItem: "ytd-video-renderer",
  itemName: "#video-title",
  itemUrl: "#thumbnail",
  itemUser: "a.yt-simple-endpoint.style-scope.yt-formatted-string",
  itemImage: "img#img.style-scope.yt-img-shadow",
  itemTags: "",
}
export const searchYoutube = async (query) => {
  /** create a browser instance, then a page instance with it */
  
  const browser = await puppeteer.launch({
    headless: true
  });

  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });
  await page.goto(YOUTUBE_BASE_URL, {timeout: 1000000});
  await page.waitForSelector(youtubeSelectors.searchField, {timeout: 1000000});
  await page.click(youtubeSelectors.searchField);
  await page.type(youtubeSelectors.searchField, query);
  await page.keyboard.press('Enter');
  await page.waitFor(1000);
  await page.waitForSelector(youtubeSelectors.searchListItem);
  let length = 0;
  let previousHeight = 0;
  let noMoreResults = 0;
  while (length < 100 && noMoreResults!==1) {
    length = await page.evaluate(`document.querySelectorAll("${youtubeSelectors.searchListItem}").length`);
    previousHeight = await page.evaluate('document.querySelector("ytd-app").scrollHeight');
    await page.evaluate('window.scrollTo(0, document.querySelector("ytd-app").scrollHeight)');
    await page.waitForFunction(`document.querySelector("ytd-app").scrollHeight > ${previousHeight}`);
    await page.waitFor(1000);

    noMoreResults = await page.evaluate('document.querySelectorAll("#contents ytd-message-renderer").length')
  }
  if(noMoreResults === 1){
    console.log("Reached no more results")
  }
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
        name: element.querySelector(itemName).title,
        url: element.querySelector(itemUrl).href,
        user: element.querySelector(itemUser).textContent,
        img: element.querySelector(itemImage).src,
        // tags: element.querySelector(itemTags).textContent,
      };
    });
  }, youtubeSelectors); // pass here any variables you need to access in the evaluate function
  return results;
};