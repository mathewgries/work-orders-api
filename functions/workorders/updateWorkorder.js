import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: process.env.workordersTable,
		// 'Key' defines the partition key and sort key of the item to be updated
		// - 'userId': Identity Pool identity id of the authenticated user
		// - 'workorderId': path parameter
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId,
			workorderId: event.pathParameters.id
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: `SET 
			title = :title, 
			clientId = :clientId, 
			contactId = :contactId, 
			description = :description, 
			modifiedAt = :modifiedAt`,
		ExpressionAttributeValues: {
			":title": data.title || null,
			":clientId": data.client.clientId || null,
			":contactId": data.contact.contactId || null,
			":description": data.description || null,
			":modifiedAt": Date.now()
		},
		ReturnValues: "ALL_NEW"
	};

	try {
		await dynamoDbLib.call("update", params);
		return success({ status: true });
	} catch (e) {
		return failure({ status: false });
	}
}