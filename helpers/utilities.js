// dependencies

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


// exports
module.exports = utilities