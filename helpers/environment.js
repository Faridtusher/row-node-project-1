// dependencies

// scaffolding
const environment = {};

// create the staging
environment.staging = {
   port:3000,
   envName:'staging',
   secretKey:'abcyhuihiji4699',
   maxCheck: 5,
   twilio:{
      fromPhone:'01714256632',
      accountSid: 'AC0b6e4028d6ca96d3fb2666590a85eea5',
      authToken: '96905303fcfbab7313ef4c71101360ee'
   }
}

// create the production
environment.production ={
   port:5000,
   envName:'production',
   secretKey: 'abcyhuihiji4699',
   maxCheck: 5,
   twilio: {
      fromPhone: '01714256631',
      accountSid: 'AC0b6e4028d6ca96d3fb2666590a85eea5',
      authToken: '96905303fcfbab7313ef4c71101360ee'
   }
}


// chosen the current environment
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

// create the object
const environmentToObject = typeof environment[currentEnvironment] === 'object' ? environment[currentEnvironment] : environment.staging;

// export
module.exports = environmentToObject;


