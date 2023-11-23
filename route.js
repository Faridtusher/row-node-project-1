// dependencies
const {checkHandler} = require('./handler/routerHandler/checkHandler')
const {tokenHandler} = require('./handler/routerHandler/tokenHandler')
const { userHandler } = require('./handler/routerHandler/userHandler')



// module scaffolding
const route ={};

// crate the all routes
route.routeHandler = {
   check:checkHandler,
   token:tokenHandler,
   user:userHandler,
}

// export the module
module.exports = route;