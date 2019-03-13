import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersClientsTable,
        Key: {
            clientId: event.pathParameters.id,
            userId: event.requestContext.identity.cognitoIdentityId,
        },
        UpdateExpression: `SET 
            name = :name,
            type = :type,
            email = :email,
            addresses = :addresses,
            phonenumbers = :phonenumbers`,
        ExpressionAttributeValues: {
            ":name": content.name,
            ":type": content.type || null,
            ":email": content.email || null,
            ":addresses": [content.addresses],
            ":phonenumbers": [content.phonenumbers]
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