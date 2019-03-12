import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from 'uuid'

export async function main(event, context) {
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersItemsTable,
        Item: {
            workordersItemId: uuid.v1(),
            userId: event.requestContext.identity.cognitoIdentityId,
            workorderId: content.workorderId,
            workordersItemType: content.workordersItemType,
            description: content.description,
            quanity: content.quanity,
            unitPrice: content.unitPrice,
            total: content.total,
            createdAt: Date.now()
        }
    }

    try {
        const result = await dynamoDbLib.call("put", params)
        return success(result.Item)
    } catch (e) {
        return failure({ status: false })
    }
}