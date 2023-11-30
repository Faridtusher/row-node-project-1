// dependencies

// scaffolding
const environment = {};

// create the staging
environment.staging = {
   port:3000,
   envName:'staging',
   secretKey:'abcyhuihiji4699'
}

// create the production
environment.production ={
   port:5000,
   envName:'production',
   secretKey: 'abcyhuihiji4699'
}


// chosen the current environment
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'staging'

// create the object
const environmentToObject = typeof environment[currentEnvironment] === 'object' ? environment[currentEnvironment] : environment.staging;

// export
module.exports = environmentToObject;


