import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {

    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersItemsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            workordersItemId: content.workordersItemId
        },
        UpdateExpression: `
            SET workordersItemType = :workordersItemType, 
                description = :description, 
                quanity = :quanity, 
                unitPrice = :unitPrice, 
                totalAmount = :totalAmount,
                modifiedAt = :modifiedAt`,
        ExpressionAttributeValues: {
            ":workordersItemType": content.workordersItemType,
            ":description": content.description,
            ":quanity": content.quanity,
            ":unitPrice": content.unitPrice,
            ":totalAmount": price,
            ":modifiedAt": Date.now()
        },
        ReturnValues: "ALL_NEW"
    }

    try {
        const result = await dynamoDbLib.call("update", params)
        return success({ status: true })
    } catch (e) {
        return failure({ status: false })
    }
}