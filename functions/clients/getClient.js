import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const params = {
        TableName: process.env.workordersClientsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            clientId: event.pathParameters.id
        }
    }

    try {
        const result = await dynamodbLib.call('get', params)
        if (result.Item) {
            return success(result.Item)
        } else {
            return failure({ status: false, error: "Client not found"})
        }
    } catch (e) {
        return failure({ status: false })
    }
}