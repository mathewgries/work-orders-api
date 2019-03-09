import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersClientsTable,
        Item: {
            clientId: content.clientId,
            userId: event.requestContext.identity.cognitoIdentityId,
            name: content.name,
            type: content.type, // Residential or Commercial
            addresses: content.addresses,
            contacts: content.phonenumbers,
            phonenumbers: [],
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