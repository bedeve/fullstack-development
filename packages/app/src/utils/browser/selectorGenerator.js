
function getPath(el, path=[]){
  if(el.nodeName === "BODY"){
      return path
  }
  const index = Array.from(el.parentNode.children).indexOf(el)
  const newPath = [`${el.nodeName}:nth-child(${index+1})`,...path]
  return getPath(el.parentNode, newPath)
}
// i = 0.2
// paths = []
// while(i <= 0.8){
// i+=0.1
// let height = i*window.innerHeight    
// paths.push(getPath(
//  document.elementFromPoint(window.innerWidth/2, 
//  height)
// ))
// }
// console.log(paths)
// equal = true
// j=0
// while(equal){
//   currentPathItem = paths[0][j]

//   for (path of paths){
//       if(path[j]!==currentPathItem){
//           equal = false
//       }
//   }
//   j++
// }
// listPath = paths[0].slice(0, j-1).join(" ")
// console.log(listPath)
// console.log(document.querySelector(listPath))