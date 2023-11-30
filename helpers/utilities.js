// dependencies
const crypto = require('crypto')
const environment = require('./environment')

// scaffolding
const utilities = {};

// make the string data to object
utilities.parseJSON = (string) =>{
   let output;
   try{
      output = JSON.parse(string)
   }catch{
      output = {};
   }
   return output
}


// hash the password
utilities.hash = (str) =>{
   if(typeof str === 'string' && str.length > 0){
      const hash = crypto.createHmac('sha256', environment.secretKey).update(str).digest('hex')
      return hash
   }
   else{
      return false
   }
}



// exports
module.exports = utilities