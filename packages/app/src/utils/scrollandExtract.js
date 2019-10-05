
const findTallestElementSelector = async (page, selector="body") => {
  tallestElement = await page.evaluate(tallestElementEvaluation, selector)
  return `${selector} :nth-child(${tallestElement.index + 1})`
}
const findMainListElement = (page, selector) => {
  
}
export default ({page, listSelector, extract}) => {
  if(!listSelector) {
    listSelector = findTallestElementSelector(page)
  }


}