import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import { currencyRounder } from '../helpers/currencyRounder'

export async function main(event, context) {

    const data = JSON.parse(event.body)
    const { content } = data
    const price = currencyRounder(content.quanity, content.unitPrice)

    const params = {
        TableName: process.env.workordersItemsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            itemId: content.itemId,
            workorderId: content.workorderId
        },
        UpdateExpression: `
            SET itemType = :itemType, 
                description = :description, 
                quanity = :quanity, 
                unitPrice = :unitPrice, 
                totalAmount = :totalAmount`,
        ExpressionAttributeValues: {
            ":description": content.description,
            ":quanity": content.quanity,
            ":unitPrice": content.unitPrice,
            ":totalAmount": price
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