import * as sst from "@serverless-stack/resources"
import { ResourceStack } from "./ResourceStack";

export function DogStack({ stack }) {

  const { 
    userPool,
    cognitoClient,
    dogsTable
  } = sst.use(ResourceStack);

  const apiDog = new sst.Api(stack, "dog-stack", {
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

      "GET /dogs/breeds": "functions/dog/actions.listBreeds",
      "GET /dogs/images": "functions/dog/actions.listImages",
      "GET /dogs/favorites": {
        function: {
          handler: "functions/dog/actions.listFavorites",
          environment: { 
            DogsTable: dogsTable.tableName
          }
        }
      },
      "POST /dogs/favorites": {
        function: {
          handler: "functions/dog/actions.addToFavorites",
          environment: { 
            DogsTable: dogsTable.tableName
          }
        }
      },
      "DELETE /dogs/favorites/{identifier}": {
        function: {
          handler: "functions/dog/actions.deleteFromFavorites",
          environment: { 
            DogsTable: dogsTable.tableName
          }
        }
      },
    },
  })
  
  apiDog.attachPermissions([
      "dynamodb:*"
  ])

  stack.addOutputs({
    ApiEndpoint: apiDog.url
  })
}