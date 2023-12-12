// dependencies


// scaffolding
const workers = {};


// create the setInterval
workers.loop = () =>{
   setInterval(() =>{
      workers.gatherAllChecks();
   }, 1000*60)
}

// create the gatherAllCheckFunction




// create workers functionality
workers.init = () =>{
   workers.gatherAllChecks();
   workers.loop();
}


// export
module.exports = workers;

