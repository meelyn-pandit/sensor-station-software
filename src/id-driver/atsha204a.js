const getDeviceId = () => {
  return new Promise((resolve, reject) =>{ 
    let id = ""
    let child = exec(`hashlet serial-num`, (error,stdout, stderr) =>{ 
      if(error){         
        reject(error)
      }   
    })  
    child.stdout.on('data', (data) => {
      id += data
    })  
    child.on('close', (code) => {
      resolve(id.substring(4, id.length -3))
    })    
  })  
}

export { getDeviceId }
