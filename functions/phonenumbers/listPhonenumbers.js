import * as dynamodbLib from '../../libs/dynamodb-lib'
import { success, failure } from '../../libs/response-lib'

export async function main(event, context){
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersPhonenumberTable,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
			":userId": event.requestContext.identity.cognitoIdentityId
		}
    }

    try {
        const result = await dynamodbLib.call("query", params)
        return success(result.Items)
    } catch (e) {
        return failure({ status: false, error: e })
    }
}