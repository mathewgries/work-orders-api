import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
    const body = JSON.parse(event.body)
    const params = {
        TableName: process.env.workordersItemsTable,
        KeyConditionExpression: "workorderId = :workorderId",
        ExpressionAttributeValues: {
            ":workorderId": body.workorderId
        }
    }

    try {
        const result = await dynamoDbLib.call("query", params)
        return success(result.Items)
    } catch (e) {
        return failure({ status: false })
    }
}