const scrape = ({
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
}

export {scrape}