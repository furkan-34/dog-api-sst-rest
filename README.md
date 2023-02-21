# Ivent Test Case - Dog Api Serverless Stack
## Summary

Project used for test case.
Serverless Stack ([SST](https://sst.dev/)) used.
[Middy](https://middy.js.org/) used for handling lambda functions with onion architecture.
Custom Error Middleware used for customize errors.
Custom Response helper used for customized responses.
All Functions wrapped with a couple middlewares (cors, error, body parser, etc.).
Except Auth stack, all stacks using jwt authorizer with cognito user pool to protect all routes.
Functions have validators which named Request Validators. Validator Schema is used for validation.

Stacks:
-   User
-   Auth (Public)
-   Dog
-   
**Please replace .env file with sst.json file to replace aws region.**

## Endpoints

API GATEWAY Endpoints Table:

| Endpoint | Body | Method | Response
| ------ | ------ | ------ | ------ |
| /auth/sigin |   { email, password }     |  POST   | 200 - Token Response |
| /auth/sigup | { email, password, name, lastname } |  POST   | 201 |
| /user/me |   |  GET   | 200 - User Informations |
| /dog/breeds |   |  GET   | 200 - Breeds List |
| /dog/images?search=african |   |  GET   | 200 - Dogs List by breed |
| /dog/favorites |   |  GET   | 200 - Favorites List |
| /dog/favorites |  { image }   |  POST   | 201  |
| /dog/favorites/identifier |  |  DELETE   | 200 - Unfavorite dog  |

## Installation

Install the dependencies and devDependencies for start the project.
```sh
npm install
npm start
```

## License

MIT
