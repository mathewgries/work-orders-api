import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
    const data = JSON.parse(event.body);

    const params = {
        TableName: process.env.workordersClientsTable,
        Key: {
            userId: event.requestContext.identity.cognitoIdentityId,
            clientId: event.pathParameters.id
        },
        UpdateExpression: `SET 
            name = :name,
            type = :type,
            email = :email,
            modifiedAt = :modifiedAt`,
        ExpressionAttributeValues: {
            ":name": data.name || null,
            ":type": data.type || null,
            ":email": data.email || null,
            ":modifiedAt": Date.now()
        },
        ReturnValues: "ALL_NEW"
    }

    try {
        await dynamoDbLib.call("update", params);
        return success({ status: true });
    } catch (e) {
        return failure({ status: false });
    }
}