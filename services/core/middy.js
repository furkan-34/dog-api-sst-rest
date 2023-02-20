import middy from '@middy/core'
import httpContentEncodingMiddleware from '@middy/http-content-encoding'
import httpCorsMiddleware from '@middy/http-cors'
import httpErrorHandlerMiddleware from '../middlewares/httpErrorHandlerMiddleware'
import httpEventNormalizerMiddleware from '@middy/http-event-normalizer'
import httpHeaderNormalizerMiddleware from '@middy/http-header-normalizer'
import httpJsonBodyParserMiddleware from '@middy/http-json-body-parser'
import httpMultipartBodyParserMiddleware from '@middy/http-multipart-body-parser'
import httpPartialResponseMiddleware from '@middy/http-partial-response'
import httpResponseSerializerMiddleware from '@middy/http-response-serializer'
import httpSecurityHeadersMiddleware from '@middy/http-security-headers'
import httpUrlencodeBodyParserMiddleware from '@middy/http-urlencode-body-parser'
import httpUrlencodePathParametersParserMiddleware from '@middy/http-urlencode-path-parser'
import validator from '@middy/validator'

import { transpileSchema } from '@middy/validator/transpile'
import customMiddleware from '../middlewares/httpErrorHandlerMiddleware'

export const lambdaHandler = (handler, requestSchema={}) => {

    return  middy(handler)
    .use(httpEventNormalizerMiddleware())
    .use(httpHeaderNormalizerMiddleware())
    .use(httpUrlencodePathParametersParserMiddleware())
    .use(httpUrlencodeBodyParserMiddleware())
    .use(httpJsonBodyParserMiddleware())
    .use(httpMultipartBodyParserMiddleware())
    .use(httpSecurityHeadersMiddleware())
    .use(httpCorsMiddleware())
    .use(httpContentEncodingMiddleware())
    .use(
        httpResponseSerializerMiddleware({
        serializers: [
            {
            regex: /^application\/json$/,
            serializer: ({ body }) => JSON.stringify(body)
            }
        ],
        default: 'application/json'
        })
    )
    .use(httpPartialResponseMiddleware())
    .use(validator({
        eventSchema: transpileSchema(requestSchema)
      }))
    .use(httpErrorHandlerMiddleware())
    .use(customMiddleware())
}
  
