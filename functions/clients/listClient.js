import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context){
    const params = {
        TableName: process.env.workordersClientsTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
            ":userId": event.requestContext.identity.cognitoIdentityId
        }
    }

    try {
        const results = await dynamodbLib.call("query", params)
        return success(results.Items)
    } catch (e) {
        return failure({ status: false})
    }
}