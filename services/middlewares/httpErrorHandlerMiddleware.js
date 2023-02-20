import {isHttpError} from "http-errors"

const defaults = {}

const errorResponse = (name, statusCode, detail) => {
  return {
    headers: {"Content-Type": "application/json"},
    statusCode,
    body: JSON.stringify({error: detail ? detail : name})
  }
}

const httpErrorHandlerMiddleware = (opts) => {
  const options = { ...defaults, ...opts }


  const httpErrorHandlerMiddlewareOnError = async (request) => {

    // Error Messages can override here
    if (isHttpError(request.error)) {

        console.log(request.error)
        return errorResponse(request.error.name, request.error.statusCode, request.error.message)
    }
    return 
  } 

  return {
    onError: httpErrorHandlerMiddlewareOnError
  }
}

export default httpErrorHandlerMiddleware