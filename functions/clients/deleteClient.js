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
        const result = dynamodbLib.call('delete', params)
        return success({ status: true })
    } catch (e) {
        return failure({ status: false })
    }
}