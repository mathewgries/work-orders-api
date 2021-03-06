import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";
import uuid from 'uuid'

export async function main(event, context){
    const data = JSON.parse(event.body)
    const { content } = data

    const params = {
        TableName: process.env.workordersContactsTable,
        Item: {
            userId: event.requestContext.identity.cognitoIdentityId,
            contactId: uuid.v1(),
            clientId: content.clientId || null,
            contactName: content.name,
            email: content.email || null,
            preferredContactMethod: content.preferredContactMethod,
            createAt: Date.now(),
            modifiedAt: null
        }
    }

    try {
        await dynamoDbLib.call("put", params)
        return success(params.Item)
    } catch (e) {
        return failure({ status: false, error: e})
    }
}