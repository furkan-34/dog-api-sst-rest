import { App } from "@serverless-stack/resources";
import { ResourceStack } from "./ResourceStack";
import { AuthStack } from "./AuthStack";
import { UserStack } from "./UserStack";
import { DogStack } from "./DogStack";

/**
 * @param {App} app
 */
export default function (app) {
  app.setDefaultFunctionProps({
    environment: { 
      SERVICE_REGION: process.env.SERVICE_REGION,
      DOG_API: process.env.DOG_API
    },
    runtime: "nodejs16.x",
    srcPath: "services",
    bundle: {
      format: "esm",
    },
  });

  app
  .stack(ResourceStack, { id: `resource-stack` })
  .stack(AuthStack, { id: `auth-stack` })
  .stack(UserStack, { id: `user-stack` })
  .stack(DogStack, { id: `dog-stack` })
}
