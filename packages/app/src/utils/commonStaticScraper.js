import url from 'url';
export function commonStaticScraper($, selectors, scrapeUrl) {
  const listItems = $(selectors.searchListItem);
  let results = [];
  listItems.each(function(i, elem) {
    const result = {};
    for(const propertyKey in selectors.properties) {
      const property = selectors.properties[propertyKey];
      const element = $(this).find(property.selector);
      // console.log(element)
      let value = "";
      switch(property.attribute) {
        case "textContent":
          value = element.text();
          break;
        case "href":
          value = url.resolve(scrapeUrl, element.attr("href"));
          break;
        default:
          value = element.attr(property.attribute);
      }
      result[propertyKey] = value;
    }
    results.push(result);
  });
  return results;
}
