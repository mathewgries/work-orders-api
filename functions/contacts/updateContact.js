import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {

    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersContactsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            contactId: content.contactId
        },
        UpdateExpression: "SET name = :name, email = :email, preferredContact = :preferredContact, clientId = :clientId",
        ExpressionAttributeValues: {
            ":name": content.name,
            ":email": content.email || null,
            ":preferredContactMethod": content.preferredContactMethod,
            ":clientId": clientId
        },
        ReturnValues: "ALL_NEW"
    }

    try {
        const result = await dynamoDbLib.call("update", params)
        return success({ status: true, result: result })
    } catch (e) {
        return failure({ status: false })
    }
}