import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {

    const params = {
        TableName: process.env.workordersItemsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            workorderid: event.data.workorderid,
            itemId: event.data.itemId
        }
    }

    try {
        const result = await dynamoDbLib.call("delete", params)
        return success({ status: true })
    } catch (e) {
        return failure({ status: false })
    }
}