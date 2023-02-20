import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function UserStack({ stack }) {

  const { 
    userPool,
    cognitoClient,
  } = sst.use(ResourceStack);

  const apiUser = new sst.Api(stack, "user-stack", {
    authorizers: {
      pool: {
        type: "user_pool",
        userPool: { 
          id: userPool.userPoolId, 
          clientIds: [cognitoClient.userPoolClientId]
        }
      },
    },
    defaults: {
      authorizer: "pool",
    },

    routes: {
      "GET /user/me": {
        function: {
          handler: "functions/user/actions.retrieveMe",
          environment: { 
            UserPoolId: userPool.userPoolId
          }
        }
      }
    },
  })
  

  apiUser.attachPermissions([
    "cognito-idp:*",
  ])
  stack.addOutputs({
    ApiEndpoint: apiUser.url
  })
}