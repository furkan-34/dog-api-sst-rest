import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function AuthStack({ stack }) {

  const { 
    userPool,
    cognitoClient,
  } = sst.use(ResourceStack);

  const apiAuth = new sst.Api(stack, "auth-stack", {
    routes: { 
      "POST /auth/signup": {
        function: {
          handler: "functions/auth/actions.signUpUser",
          environment: { 
            UserPoolId: userPool.userPoolId
          }
        }
      },
      "POST /auth/signin": {
        function: {
          handler: "functions/auth/actions.signInUser",
          environment: { 
            UserClientId: cognitoClient.userPoolClientId
          }
        }
      },

    },
  })
  
  apiAuth.attachPermissions([
    "cognito-idp:*",
  ])

  stack.addOutputs({
    ApiEndpoint: apiAuth.url
  })
}