import { lambdaHandler } from "../../core/middy"
import { apiResponse } from "../../helpers/response"

export const retrieveMe = lambdaHandler(async (event) => {
   
    return apiResponse(200, {user: event.requestContext.authorizer.jwt.claims})
})
  