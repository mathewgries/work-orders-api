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
        UpdateExpression: `SET 
            #cn = :cn,
            email = :e,
            preferredContactMethod = :pcm,
            clientId = :clientId,
            modifiedAt = :modified`,
        ExpressionAttributeValues: {
            ":cn": content.name,
            ":e": content.email || null,
            ":pcm": content.preferredContactMethod,
            ":clientId": content.clientId || null,
            ":modified": Date.now()
        },
        ExpressionAttributeNames: {
			"#cn": "name",
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