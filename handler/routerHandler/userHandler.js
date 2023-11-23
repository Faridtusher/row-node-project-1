// dependencies

// module scaffolding
const handelRoute = {};

// create the check handel function
handelRoute.userHandler = (requestProperties, callBack) => {
   callBack(200, {
      message: 'this is the user page'
   })
}

// export
module.exports = handelRoute;