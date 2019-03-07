import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)

    const params = {
        TableName: process.env.workordersClientsTable,
        Key: {
            clientId: event.pathParameters.id,
            userId: event.requestContext.identity.cognitoIdentityId,
        },
        UpdateExpression: "SET type = :type, email = :email",
        ExpressionAttributeValues: {
            ":type": data.type || null,
            ":email": data.email || null
        },
        ReturnValue: "ALL_NEW"
    }

    try {
        await dynamodbLib.call('update', params)
        return success({ status: true })
    } catch (e) {
        return failure({ success: false })
    }
}