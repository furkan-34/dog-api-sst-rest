import createHttpError from "http-errors";
import { lambdaHandler } from "../../core/middy";
import { apiResponse } from "../../helpers/response";
import { signInUserRequestValidator, signUpUserRequestValidator } from "./requestValidators";

const { 
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  InitiateAuthCommand
} = require("@aws-sdk/client-cognito-identity-provider");


export const signUpUser = lambdaHandler(async (event) => {


  const { email, name, password, lastname } = event.body
  

    const cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.SERVICE_REGION
    })
    const adminCreateUserCommand = new AdminCreateUserCommand({
      UserPoolId: process.env.UserPoolId,
      Username: email,
      UserAttributes: [
        {
          Name: "name",
          Value: name
        },
        {
          Name: "family_name",
          Value: lastname
        }
      ]
    })
    const adminSetUserPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: process.env.UserPoolId,
      Username: email,
      Password: password,
      Permanent: true
    })

    try {
      await cognitoClient.send(adminCreateUserCommand)
      await cognitoClient.send(adminSetUserPasswordCommand)
    } catch (error) {
      throw new createHttpError.InternalServerError({error: error.name})
    }

    return apiResponse(200, { message: `${email} is registered successfully!` })
}, signUpUserRequestValidator)

export const signInUser = lambdaHandler(async (event) => {
   
  const { email, password } = event.body


  const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.SERVICE_REGION
  })

  const initiateAuthCommand = new InitiateAuthCommand({
    AuthFlow: "USER_PASSWORD_AUTH",
    AuthParameters: { 
      USERNAME : email,
      PASSWORD : password 
    },
    ClientId: process.env.UserClientId
 })

  try {

    const signIn = await cognitoClient.send(initiateAuthCommand)
    return apiResponse(200, {signIn: signIn.AuthenticationResult})

  } catch (error) {
    if (error.name == "NotAuthorizedException") throw new createHttpError.Unauthorized()
    throw new createHttpError.InternalServerError({error: error.name})
  }
}, signInUserRequestValidator)
