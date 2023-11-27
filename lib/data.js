// dependencies
const path = require('path')
const fs = require('fs');
const { monitorEventLoopDelay } = require('perf_hooks');

// module scaffolding
const lib = {};

// create the base dir
lib.basedir = path.join(__dirname, ('../.data/'))

// create the file
lib.create = (dir, file, data, callback) => {
   // open the file
   fs.open(`${lib.basedir+dir}/${file}.json`, 'wx', (err1, fileDescriptor) =>{
      if(!err1 && fileDescriptor){
         // string the data
         const stringData = JSON.stringify(data);

         // write the data
         fs.writeFile(fileDescriptor, stringData, (err2) =>{
            if(!err2){
               // close the file
               fs.close(fileDescriptor, (err3) =>{
                  if(!err3){
                     callback(200,{
                        message:'success'
                     })
                  }
                  else{
                     callback(401, {
                        message: 'Fail to close the file'
                     })
                  }
               })
            }
            else{
               callback(402, {
                  message: 'can not write the file'
               })
            }
         })
      }
      else{
         callback(403,{
            message:'can not open the file'
         })
      }
   })
}


// read the data
lib.read = (dir, file, callback) =>{
   // open the file
   fs.readFile(`${lib.basedir+dir}/${file}.json`, 'utf-8', (err1 , data) =>{
      if(!err1 && data){
         callback(err1, data)
      }
      else{
         callback(400,{
            message:'can not open the file'
         })
      }
   })
}

// update the data
lib.update = (dir, file, data, callback) =>{
   // open the file
   fs.open(`${lib.basedir+dir}/${file}.json`, 'r+', (err1, fileDescriptor) =>{
      if(!err1 && fileDescriptor){
         const stringData = JSON.stringify(data)
         // truncate the file
         fs.ftruncate(fileDescriptor, (err2) =>{
            if(!err2 && fileDescriptor){
               // create the new file
               fs.writeFile(fileDescriptor, stringData, (err3) =>{
                  if(!err3 && fileDescriptor){
                     callback(200,{
                        message:'successfully'
                     })
                  }
                  else{
                     callback(400,{
                        message:'Can not writ the file'
                     })
                  }
               })
            }
            else{
               callback(401,{
                  message:'File was not change'
               })
            }
         })
      }
      else{
         callback(400,{
            message:'Con not open the file'
         })
      }
   })
   
}

// delete the data
lib.delete = (dir, file, callback) =>{
   fs.unlink(`${lib.basedir+dir}/${file}.json`, (err1) =>{
      if(!err1){
         callback(200,{
            message:'successfully delete the file'
         })
      }
      else{
         callback(400,{
            message:'can not delete'
         })
      }
   })
}

// exports the data
module.exports = lib;