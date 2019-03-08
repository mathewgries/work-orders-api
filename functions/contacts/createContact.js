import uuid from "uuid";
import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context){
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersContactsTable,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            contactId: uuid.v1(),
            clientId: content.clientId,
            name: content.name,
            email: content.email || null,
            phonenumbers: [],
            preferredContactMethod: content.preferredContactMethod
        }
    }

    try {
        const result = await dynamoDbLib.call("put", params)
        return success(result.Item)
    } catch (e) {
        return failure({ status: false})
    }
}