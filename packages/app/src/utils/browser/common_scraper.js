const scrape = (props) => {
   
  const elements = Array.from(document.querySelectorAll(props.searchListItem));
  return elements.map(element => {
    const result = {}
    for(let key  in props.properties){
      const {selector, attribute} = props.properties[key]
      result[key] = element.querySelector(selector)[attribute]
    }

    return result;
  });
}

export {scrape}