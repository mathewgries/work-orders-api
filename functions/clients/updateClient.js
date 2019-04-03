import * as dynamoDbLib from "../../libs/dynamodb-lib";
import { success, failure } from "../../libs/response-lib";

export async function main(event, context) {
	const data = JSON.parse(event.body);
	const params = {
		TableName: process.env.workordersClientsTable,
		// 'Key' defines the partition key and sort key of the item to be updated
		// - 'userId': Identity Pool identity id of the authenticated user
		// - 'workorderId': path parameter
		Key: {
			userId: event.requestContext.identity.cognitoIdentityId,
			clientId: event.pathParameters.id
		},
		// 'UpdateExpression' defines the attributes to be updated
		// 'ExpressionAttributeValues' defines the value in the update expression
		UpdateExpression: `SET 
			#n = :n, 
			#t = :t, 
			email = :email, 
			modifiedAt = :modifiedAt`,
		ExpressionAttributeValues: {
			":n": data.name || null,
			":t": data.type || null,
			":email": data.email || null,
			":modifiedAt": Date.now()
		},
		ExpressionAttributeNames: {
			"#n": "name",
			"#t": "type"
		},
		ReturnValues: "ALL_NEW"
	};

	try {
		await dynamoDbLib.call("update", params);
		return success({ status: true });
	} catch (e) {
		return failure({ status: false, error: e});
	}
}