import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {

    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersContactsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            contactId: event.pathParameters.id
        },
        UpdateExpression: "SET name = :name, email = :email, preferredContact = :preferredContact",
        ExpressionAttributeValues: {
            ":name": content.name,
            ":email": content.email || null,
            ":preferredContact": content.contactMethod
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