import request from "request";



function asyncRequest(url){
  return new Promise((resolve, reject)=>{
    request(url, function (error, response, html) {
      if (!error && response.statusCode === 200) {
        resolve(html)
      }else if(error){
        reject(error)
      }
    });
  })
}

export default asyncRequest;