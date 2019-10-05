const tallestElement = (selector) => {
    return Array.from(
      document.querySelector(selector).children
      ).reduce(
          (tallestElement, element, index)=>{
              const height = element.getBoundingClientRect().height 
              if( height > tallestElement.height){
                  return {index, height};
              }
              return tallestElement;
          }
      ,{index: 0, height: 0})
  }
  export default tallestElement
