import createHttpError from "http-errors"
import { lambdaHandler } from "../../core/middy"
import { apiResponse } from "../../helpers/response"

import { DynamoDBClient, PutItemCommand, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import { unixTimestamp } from "../helpers/timestamp";

export const listBreeds = lambdaHandler(async (event) => {
    
    const dogResponse = await axios.get(process.env.DOG_API + "/breeds/list/all")
    const breeds = Object.keys(dogResponse.data.message)

    return apiResponse(200, {breeds: breeds})
})
 

export const listImages = lambdaHandler(async (event) => {

    const { search } = event.queryStringParameters

    const breedResponse = await axios.get(process.env.DOG_API + "/breeds/list/all")
    const breeds = Object.keys(breedResponse.data.message)

    if (search) {
        if (!breeds.includes(search)) throw new createHttpError.BadRequest()

        try {
            const dogResponse = await axios.get(process.env.DOG_API + `/breed/${search}/images`)
            return apiResponse(200, { images: dogResponse.data.message.slice(0, 10) })
        } catch (error) {
            throw new createHttpError.BadRequest()
        }
    }

    const imagePromises = []
    let images = []
    breeds.forEach(breed => imagePromises.push(axios.get(process.env.DOG_API + `/breed/${breed}/images`)))

    let promiseResults = await Promise.all(imagePromises)
    for (const promiseResult of promiseResults) {
        images = images.concat(promiseResult.data.message)
    }
   
    return apiResponse(200, {images: images})
})

export const addToFavorites = lambdaHandler(async (event) => {
    const { image } = event.body
    
    const user = event.requestContext.authorizer.jwt.claims

    const dynamoDBClient = new DynamoDBClient({
        region: process.env.SERVICE_REGION
    })
    const putItemCommand = new PutItemCommand({
        TableName: process.env.DogsTable,
        Item: {
        identifier: { S: `${uuidv4()}` },
        image: { S: `${image}` },
        username: { S: `${user.email}` },
        timestamp: { N: `${unixTimestamp()}` },
        },
    })

    try {
        await dynamoDBClient.send(putItemCommand)
        return apiResponse(201, { message: `Image is favorited successfully!`})
    } catch (error) {
        throw new createHttpError.InternalServerError({error: error.name})
    }
})

export const deleteFromFavorites = lambdaHandler(async (event) => {
    const { identifier } = event.pathParameters
    
    const user = event.requestContext.authorizer.jwt.claims

    const dynamoDBClient = new DynamoDBClient({
        region: process.env.SERVICE_REGION
    })

    const scanCommand  = new ScanCommand({
        TableName: process.env.DogsTable,
        FilterExpression: "identifier=:identifier and username=:username",
        ExpressionAttributeValues: {
        ":identifier": { "S": `${identifier}` },
        ":username": { "S": `${user.email}` }
        }
    })

    try {
        const scanResponse = await dynamoDBClient.send(scanCommand)
        const item = unmarshall(scanResponse.Items[0])
        
        if (!item) throw new createHttpError.NotFound({ message: "Item Not Exists."})

        const deleteItemCommand = new DeleteItemCommand({
            TableName: process.env.DogsTable,
            Key: {
            identifier: { S: `${identifier}` },
            timestamp: { N: `${item.timestamp}` },
            }
        })

        await dynamoDBClient.send(deleteItemCommand)
        return apiResponse(200, { message: `Image is deleted from favorites successfully!`})
    } catch (error) {
        throw new createHttpError.InternalServerError({error: error.name})
    }
})

export const listFavorites = lambdaHandler(async (event) => {
    
    const user = event.requestContext.authorizer.jwt.claims

    const dynamoDBClient = new DynamoDBClient({
      region: process.env.SERVICE_REGION
    })
    const scanCommand  = new ScanCommand({
      TableName: process.env.DogsTable,
      FilterExpression: "username = :username",
      ExpressionAttributeValues: {
          ":username": { "S": `${user.email}` }
      }
    })
  
    try {
      const response = await dynamoDBClient.send(scanCommand)
      const items = response.Items.map(item => unmarshall(item))
  
      return apiResponse(200, { favorites: items})
    } catch (error) {
        throw new createHttpError.InternalServerError({error: error.name})
    }
})








