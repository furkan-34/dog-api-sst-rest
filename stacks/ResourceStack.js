import * as sst from "@serverless-stack/resources"
import * as cdk from 'aws-cdk-lib'
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb'
import * as cognito from 'aws-cdk-lib/aws-cognito'

export function ResourceStack({ stack }) {


  const userPool = new cognito.UserPool(stack, 'userpool', {
    userPoolName: `dog-api-${stack.stage}-cognito-user-pool`,
    selfSignUpEnabled: true,
    signInAliases: {
      email: true,
    },
    autoVerify: {
      email: true,
    },
    standardAttributes: {
      givenName: {
        required: true,
        mutable: true,
      },
      familyName: {
        required: true,
        mutable: true,
      },
    },
    passwordPolicy: {
      minLength: 6,
      requireLowercase: false,
      requireDigits: false,
      requireUppercase: false,
      requireSymbols: false,
    },
    accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    removalPolicy: cdk.RemovalPolicy.DESTROY,
  });

  const standardCognitoAttributes = {
    givenName: true,
    familyName: true,
    email: true,
    emailVerified: true,
    address: true,
    birthdate: true,
    gender: true,
    locale: true,
    middleName: true,
    fullname: true,
    nickname: true,
    phoneNumber: true,
    phoneNumberVerified: true,
    profilePicture: true,
    preferredUsername: true,
    profilePage: true,
    timezone: true,
    lastUpdateTime: true,
    website: true,
  };

  const clientReadAttributes = new cognito.ClientAttributes()
  .withStandardAttributes(standardCognitoAttributes)

  const clientWriteAttributes = new cognito.ClientAttributes()
  .withStandardAttributes({
    ...standardCognitoAttributes,
    emailVerified: false,
    phoneNumberVerified: false,
  })

  const cognitoClient = userPool.addClient(`dog-api-${stack.stage}-app-client`, {
    
    supportedIdentityProviders: [
      cognito.UserPoolClientIdentityProvider.COGNITO,
    ],
    authFlows: {
      adminUserPassword: true,
      userPassword: true,
      custom: false,
      userSrp: false,
    },
    
    writeAttributes: clientWriteAttributes,
    readAttributes: clientReadAttributes
  });

    const dogsTable = new dynamodb.Table(stack, `dogs-${stack.stage}-table`, {
        partitionKey: {name: 'identifier', type: dynamodb.AttributeType.STRING},
        sortKey: {name: 'timestamp', type: dynamodb.AttributeType.NUMBER},
        billingMode: dynamodb.BillingMode.PROVISIONED,
        readCapacity: 1,
        writeCapacity: 1,
        removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    
    return {
        userPool,
        cognitoClient,
        dogsTable
    };
}