export const signUpUserRequestValidator = {
    type: 'object',
    properties: {
      body: {
        type: 'object',
        properties: {
            email: { type: 'string', minLength: 1, maxLength: 30},
            password: { type: 'string', minLength: 6, maxLength: 30},
            name: { type: 'string', minLength: 2, maxLength: 30},
            lastname: { type: 'string', minLength: 2, maxLength: 30},
        },
        required: ['email', "password", "name", "lastname"]
      },
    },
    required: ['body']
}

export const signInUserRequestValidator = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
          email: { type: 'string', minLength: 1, maxLength: 30},
          password: { type: 'string', minLength: 6, maxLength: 30},
      },
      required: ['email', "password"]
    },
  },
  required: ['body']
}

