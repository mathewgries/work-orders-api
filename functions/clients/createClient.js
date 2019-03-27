import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'
import uuid from 'uuid'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersClientsTable,
        Item: {
            clientId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            name: content.name,
            type: content.type || null, // Residential or Commercial
            email: content.email || null,
            createdAt: Date.now()
        }
    }

    try {
        await dynamodbLib.call('put', params)
        return success(params.Item)
    } catch (e) {
        return failure({ status: false})
    }
}