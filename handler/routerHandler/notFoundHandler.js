// dependencies

// module scaffolding
const handelRoute = {};

// create the check handel function
handelRoute.notFoundHandler = (requestProperties, callBack) => {
   callBack(404,{
      message:'This is the not found page'
   })
}

// export
module.exports = handelRoute;